/**
 * DO NOT MODIFY BY HAND! This file was automatically generated.
 * Instead, modify the original JSONSchema file in suite-data package, and rebuild the project.
 */

/**
 * ISO 8601 date-time format.
 */
export type DateTime = string;
export type Version = string | string[];
export type Model = 'T' | '1';
/**
 * Eligible authorized vendors.
 */
export type Vendor = 'trezor.io';
export type Variant = 'info' | 'warning' | 'critical';
export type Category = 'banner' | 'context' | 'modal';

/**
 * JSON schema of the Trezor Suite messaging system.
 */
export interface MessageSystem {
    /**
     * A version of the messaging system. In case we would change the format of the config itself.
     */
    version: number;
    timestamp: DateTime;
    /**
     * An increasing counter. Trezor Suite must decline any sequence lower than the latest number. This is to protect against replay attacks, where an attacker could send an older version of the file, and Trezor Suite would accept it.
     */
    sequence: number;
    actions: Action[];
}
export interface Action {
    conditions: Condition[];
    message: Message;
}
export interface Condition {
    duration?: Duration;
    os?: OperatingSystem;
    environment?: Environment;
    browser?: Browser;
    settings?: Settings[];
    transport?: Transport;
    devices?: Device[];
}
export interface Duration {
    from: DateTime;
    to: DateTime;
}
export interface OperatingSystem {
    macos: Version;
    linux: Version;
    windows: Version;
    android: Version;
    ios: Version;
    [k: string]: Version;
}
export interface Environment {
    desktop: Version;
    mobile: Version;
    web: Version;
    [k: string]: Version;
}
export interface Browser {
    firefox: Version;
    chrome: Version;
    chromium: Version;
    [k: string]: Version;
}
/**
 * If a setting is not specified, then it can be either true or false. Currently, 'tor' and coin symbols are supported.
 */
export interface Settings {
    tor?: boolean;
    [k: string]: unknown;
}
export interface Transport {
    bridge: Version;
    webusbplugin: Version;
    [k: string]: Version;
}
export interface Device {
    model: Model;
    firmware: Version;
    vendor: Vendor;
}
export interface Message {
    id: string;
    priority: number;
    dismissible: boolean;
    variant: Variant;
    category: Category | Category[];
    content: Localization;
    cta?: CTA;
    modal?: Modal;
    context?: Context;
}
/**
 * A multilingual text localization.
 */
export interface Localization {
    'en-GB': string;
    [k: string]: string;
}
/**
 * Only used for 'banner' and 'context' categories.
 */
export interface CTA {
    action: 'internal-link' | 'external-link';
    href: string;
    label: Localization;
}
/**
 * Only used for 'modal' category.
 */
export interface Modal {
    title: Localization;
    image: string;
}
/**
 * Only used for 'context' category.
 */
export interface Context {
    /**
     * The domain to which the message applies. Wildcards are allowed. Only used for 'context' category.
     */
    domain: string | string[];
}
