export const FETCH_CONFIG_SUCCESS = '@message-system/fetch-config-success';
export const FETCH_CONFIG_SUCCESS_UPDATE = '@message-system/fetch-config-success-update';
export const FETCH_CONFIG_ERROR = '@message-system/fetch-config-error';
export const USE_BUNDLED_CONFIG = '@message-system/use-bundled-config';

export const SAVE_VALID_MESSAGES = '@message-system/save-valid-messages';
export const DISMISS_MESSAGE = '@message-system/dismiss-message';

// every 6 hours the message system config should be fetched
export const FETCH_INTERVAL = 21600000; // in milliseconds
// every 10 minutes the message system fetching interval should be checked
export const FETCH_CHECK_INTERVAL = 600000; // in milliseconds

/*
 * Bump version in case the new version of message system is not backward compatible.
 * Have to be in sync with version in 'suite-data' package in message-system index file.
 */
export const MESSAGE_SYSTEM_VERSION = 1;

// TODO: change to production URL https://data.trezor.io/config/stable/config.v1.json
// TODO: make advanced settings url switch
export const MESSAGE_SYSTEM_CONFIG_URL =
    'https://satoshilabs-assignment.s3.eu-central-1.amazonaws.com/signature.jws';
