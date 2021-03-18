import * as jws from 'jws';
import bundledConfig from '@trezor/suite-data/files/message-system/config.json'; // TODO: can be in separate bundle

import { Category, MessageSystem } from '@suite-types/messageSystem';
import { MESSAGE_SYSTEM } from '@suite-actions/constants';
import { Dispatch, GetState } from '@suite-types';
import {
    FETCH_CHECK_INTERVAL,
    FETCH_INTERVAL,
    MESSAGE_SYSTEM_CONFIG_URL,
    MESSAGE_SYSTEM_VERSION,
} from '@suite-actions/constants/messageSystemConstants';
import { JWS_PUBLIC_KEY } from '@suite-constants/keys';

export type MessageSystemAction =
    | { type: typeof MESSAGE_SYSTEM.FETCH_CONFIG_SUCCESS }
    | { type: typeof MESSAGE_SYSTEM.FETCH_CONFIG_SUCCESS_UPDATE; payload: MessageSystem }
    | { type: typeof MESSAGE_SYSTEM.FETCH_CONFIG_ERROR }
    | { type: typeof MESSAGE_SYSTEM.USE_BUNDLED_CONFIG; payload: MessageSystem }
    | {
          type: typeof MESSAGE_SYSTEM.SAVE_VALID_MESSAGES;
          category: Category;
          payload: string[];
      }
    | {
          type: typeof MESSAGE_SYSTEM.DISMISS_MESSAGE;
          category: Category;
          id: string;
      };

const fetchSuccess = (): MessageSystemAction => ({
    type: MESSAGE_SYSTEM.FETCH_CONFIG_SUCCESS,
});

const fetchSuccessUpdate = (payload: MessageSystem): MessageSystemAction => ({
    type: MESSAGE_SYSTEM.FETCH_CONFIG_SUCCESS_UPDATE,
    payload,
});

const fetchError = (): MessageSystemAction => ({
    type: MESSAGE_SYSTEM.FETCH_CONFIG_ERROR,
});

const useBundledConfig = (payload: MessageSystem): MessageSystemAction => ({
    type: MESSAGE_SYSTEM.USE_BUNDLED_CONFIG,
    payload,
});

const fetchConfig = () => async (dispatch: Dispatch, getState: GetState) => {
    const { timestamp, currentSequence } = getState().messageSystem;

    if (Date.now() >= timestamp + FETCH_INTERVAL) {
        try {
            const response = await fetch(MESSAGE_SYSTEM_CONFIG_URL);
            const jwsResponse = await response.text();

            const decodedJws = jws.decode(jwsResponse);

            if (!decodedJws) {
                throw Error('Decoding of config failed');
            }

            const { alg } = decodedJws?.header;
            const isAuthenticityValid = jws.verify(jwsResponse, alg, JWS_PUBLIC_KEY);

            if (!isAuthenticityValid) {
                throw Error('Config authenticity is invalid');
            }

            const config: MessageSystem = JSON.parse(decodedJws.payload);

            if (MESSAGE_SYSTEM_VERSION !== config.version) {
                throw Error('Config version is not supported');
            }

            if (currentSequence < config.sequence) {
                await dispatch(fetchSuccessUpdate(config));
            } else if (currentSequence === config.sequence) {
                await dispatch(fetchSuccess());
            } else {
                throw Error('Sequence of config is older than the current one');
            }
        } catch (error) {
            console.error('MessageSystem:', error);
            await dispatch(fetchError());

            const config = bundledConfig as MessageSystem;
            if (
                config &&
                MESSAGE_SYSTEM_VERSION === config.version &&
                currentSequence < config.sequence
            ) {
                await dispatch(useBundledConfig(config));
            }
        }
    }
};

export const init = () => async (dispatch: Dispatch, _getState: GetState) => {
    await dispatch(fetchConfig());

    setInterval(async () => {
        await dispatch(fetchConfig());
    }, FETCH_CHECK_INTERVAL);
};

export const saveValidMessages = (payload: string[], category: Category) => ({
    type: MESSAGE_SYSTEM.SAVE_VALID_MESSAGES,
    payload,
    category,
});

export const dismissMessage = (id: string, category: Category) => ({
    type: MESSAGE_SYSTEM.DISMISS_MESSAGE,
    id,
    category,
});
