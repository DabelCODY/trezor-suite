import Bowser from 'bowser';
import * as semver from 'semver';
import { TransportInfo } from 'trezor-connect';

import {
    Duration,
    MessageSystem,
    Message,
    Version,
    OperatingSystem,
    Settings,
    Transport,
    Browser,
    Device,
    Environment,
} from '@suite-types/messageSystem';
import { Network } from '@wallet-types';
import { SuiteEnvironmentType, TrezorDevice } from '@suite-types';
import { getUserAgent, getEnvironment } from '@suite-utils/env';

type CurrentSettings = {
    tor: boolean;
    enabledNetworks: Network['symbol'][];
};

export type Options = {
    settings: CurrentSettings;
    transport?: Partial<TransportInfo>;
    device?: TrezorDevice;
};

// normalize versions for semver library
export const normalizeVersion = (version: Version | undefined): string | null => {
    if (version === undefined || version === '!') {
        return null;
    }

    if (typeof version === 'string') {
        return version;
    }

    return version.join(' || ');
};

export const validateDurationCompatibility = (durationCondition: Duration): boolean => {
    const currentDate = Date.now();

    const from = Date.parse(durationCondition.from);
    const to = Date.parse(durationCondition.to);

    return from <= currentDate && currentDate <= to;
};

export const validateVersionCompatibility = (
    condition: Browser | OperatingSystem | Environment | Transport,
    type: string | SuiteEnvironmentType,
    version: string,
): boolean => {
    const conditionVersion = normalizeVersion(condition[type]);

    if (conditionVersion === null) {
        return false;
    }

    return semver.satisfies(version, conditionVersion);
};

export const validateSettingsCompatibility = (
    settingsCondition: Settings[],
    currentSettings: CurrentSettings,
): boolean => {
    const settings: {
        [key: string]: any;
    } = currentSettings.enabledNetworks.reduce((o, key) => Object.assign(o, { [key]: true }), {
        tor: currentSettings.tor,
    });

    return settingsCondition.some(settingCondition =>
        Object.entries(settingCondition).every(
            ([key, value]: [string, boolean | unknown]) =>
                settings[key] === value || (!value && settings[key] === undefined),
        ),
    );
};

export const validateTransportCompatibility = (
    transportCondition: Transport,
    transport?: Partial<TransportInfo>,
): boolean => {
    if (!transport || !transport.type || !transport.version) {
        return false;
    }

    const { version } = transport;
    const type = transport.type.toLowerCase();

    return validateVersionCompatibility(transportCondition, type, version);
};

export const validateDeviceCompatibility = (
    deviceConditions: Device[],
    device?: TrezorDevice,
): boolean => {
    // if conditions are empty, then device should be empty
    if (!deviceConditions.length) {
        return !device;
    }
    if (!device || !device.features) {
        return false;
    }

    const {
        model,
        vendor,
        major_version: majorVersion,
        minor_version: minorVersion,
        patch_version: patchVersion,
    } = device.features;

    const deviceVersion = `${majorVersion}.${minorVersion}.${patchVersion}`;

    return deviceConditions.some(
        deviceCondition =>
            deviceCondition.model.toLowerCase() === model.toLowerCase() &&
            deviceCondition.vendor.toLowerCase() === vendor.toLowerCase() &&
            semver.satisfies(deviceVersion, normalizeVersion(deviceCondition.firmware)!),
    );
};

export const getValidMessages = (config: MessageSystem | null, options: Options): Message[] => {
    if (!config) {
        return [];
    }

    const { device, transport, settings } = options;

    const ua = Bowser.getParser(getUserAgent());

    const osDetail = ua.getOS();
    const currentOsName = osDetail.name?.toLowerCase() || '';
    const currentOsVersion = semver.valid(semver.coerce(osDetail.version)) || '';

    const browserDetail = ua.getBrowser();
    const currentBrowserName = browserDetail.name?.toLowerCase() || '';
    const currentBrowserVersion = semver.valid(semver.coerce(browserDetail.version)) || '';

    const environment = getEnvironment();
    const suiteVersion = semver.valid(semver.coerce(process.env.VERSION)) || '';

    return config.actions
        .filter(
            action =>
                !action.conditions.length ||
                action.conditions.some(condition => {
                    const {
                        duration: durationCondition,
                        environment: environmentCondition,
                        os: osCondition,
                        browser: browserCondition,
                        transport: transportCondition,
                        settings: settingsCondition,
                        devices: deviceCondition,
                    } = condition;

                    if (durationCondition && !validateDurationCompatibility(durationCondition)) {
                        return false;
                    }

                    if (
                        environmentCondition &&
                        !validateVersionCompatibility(
                            environmentCondition,
                            environment,
                            suiteVersion,
                        )
                    ) {
                        return false;
                    }

                    if (
                        osCondition &&
                        !validateVersionCompatibility(osCondition, currentOsName, currentOsVersion)
                    ) {
                        return false;
                    }

                    if (
                        environment === 'web' &&
                        browserCondition &&
                        !validateVersionCompatibility(
                            browserCondition,
                            currentBrowserName,
                            currentBrowserVersion,
                        )
                    ) {
                        return false;
                    }

                    if (
                        settingsCondition &&
                        !validateSettingsCompatibility(settingsCondition, settings)
                    ) {
                        return false;
                    }

                    if (
                        transportCondition &&
                        !validateTransportCompatibility(transportCondition, transport)
                    ) {
                        return false;
                    }

                    if (deviceCondition && !validateDeviceCompatibility(deviceCondition, device)) {
                        return false;
                    }

                    return true;
                }),
        )
        .map(action => action.message);
};
