import { MiddlewareAPI } from 'redux';
import { TRANSPORT } from 'trezor-connect';

import { Category, Message } from '@suite-types/messageSystem';
import { MESSAGE_SYSTEM, STORAGE, SUITE } from '@suite-actions/constants';
import { AppState, Action, Dispatch } from '@suite-types';
import { getValidMessages, Options } from '@suite-utils/messageSystem';
import { WALLET_SETTINGS } from '@suite/actions/settings/constants';
import { saveValidMessages } from '@suite/actions/suite/messageSystemActions';

const messageSystemMiddleware = (api: MiddlewareAPI<Dispatch, AppState>) => (next: Dispatch) => (
    action: Action,
): Action => {
    next(action);

    // All actions listed below can affect message system
    if (
        action.type === STORAGE.LOADED ||
        action.type === SUITE.SELECT_DEVICE ||
        action.type === SUITE.TOR_STATUS ||
        action.type === TRANSPORT.START ||
        action.type === MESSAGE_SYSTEM.FETCH_CONFIG_SUCCESS_UPDATE ||
        action.type === MESSAGE_SYSTEM.USE_BUNDLED_CONFIG ||
        action.type === WALLET_SETTINGS.CHANGE_NETWORKS
    ) {
        const { config } = api.getState().messageSystem;
        const { device, transport, tor } = api.getState().suite;
        const { enabledNetworks } = api.getState().wallet.settings;

        const options: Options = {
            device,
            transport,
            settings: {
                tor,
                enabledNetworks,
            },
        };

        const messages = getValidMessages(config, options);

        if (messages.length) {
            const banners: string[] = [];
            const modals: string[] = [];
            const contexts: string[] = [];

            messages.forEach((message: Message) => {
                let { category: categories } = message;

                if (typeof categories === 'string') {
                    categories = [categories];
                }

                categories.forEach((category: Category) => {
                    if (category === 'banner') {
                        banners.push(message.id);
                    } else if (category === 'modal') {
                        modals.push(message.id);
                    } else if (category === 'context') {
                        contexts.push(message.id);
                    }
                });
            });

            api.dispatch(saveValidMessages(banners, 'banner'));
            api.dispatch(saveValidMessages(modals, 'modal'));
            api.dispatch(saveValidMessages(contexts, 'context'));
        }
    }

    return action;
};

export default messageSystemMiddleware;
