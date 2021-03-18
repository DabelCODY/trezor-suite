import * as messageSystem from '../messageSystem';
import * as fixtures from '../__fixtures__/messageSystem';
import * as env from '@suite-utils/env';

describe('Message system utils', () => {
    describe('normalizeVersion', () => {
        fixtures.normalizeVersion.forEach(f => {
            it(f.description, () => {
                expect(messageSystem.normalizeVersion(f.input)).toEqual(f.result);
            });
        });
    });

    describe('validateDurationCompatibility', () => {
        fixtures.validateDurationCompatibility.forEach(f => {
            it(f.description, () => {
                jest.spyOn(Date, 'now').mockImplementation(() => Date.parse(f.currentDate));

                expect(messageSystem.validateDurationCompatibility(f.durationCondition)).toEqual(
                    f.result,
                );
            });
        });
    });

    describe('validateSettingsCompatibility', () => {
        fixtures.validateSettingsCompatibility.forEach(f => {
            it(f.description, () => {
                expect(
                    messageSystem.validateSettingsCompatibility(
                        f.settingsCondition,
                        // @ts-ignore
                        f.currentSettings,
                    ),
                ).toEqual(f.result);
            });
        });
    });

    describe('validateVersionCompatibility', () => {
        fixtures.validateVersionCompatibility.forEach(f => {
            it(f.description, () => {
                expect(
                    // @ts-ignore
                    messageSystem.validateVersionCompatibility(f.condition, f.type, f.version),
                ).toEqual(f.result);
            });
        });
    });

    describe('validateTransportCompatibility', () => {
        fixtures.validateTransportCompatibility.forEach(f => {
            it(f.description, () => {
                expect(
                    messageSystem.validateTransportCompatibility(f.transportCondition, f.transport),
                ).toEqual(f.result);
            });
        });
    });

    describe('validateDeviceCompatibility', () => {
        fixtures.validateDeviceCompatibility.forEach(f => {
            it(f.description, () => {
                expect(
                    // @ts-ignore
                    messageSystem.validateDeviceCompatibility(f.deviceConditions, f.device),
                ).toEqual(f.result);
            });
        });
    });

    describe('getValidMessages', () => {
        fixtures.getValidMessages.forEach(f => {
            const OLD_ENV = { ...process.env };

            afterEach(() => {
                jest.resetModules();
                process.env = OLD_ENV;
            });

            it(f.description, () => {
                jest.spyOn(Date, 'now').mockImplementation(() => new Date(f.currentDate).getTime());
                jest.spyOn(env, 'getUserAgent').mockImplementation(() => f.userAgent);
                // @ts-ignore
                jest.spyOn(env, 'getEnvironment').mockImplementation(() => f.environment);
                process.env.VERSION = f.suiteVersion;

                // @ts-ignore
                expect(messageSystem.getValidMessages(f.config, f.options)).toEqual(f.result);
            });
        });
    });
});
