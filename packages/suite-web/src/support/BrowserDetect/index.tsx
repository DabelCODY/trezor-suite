// No styled components here, this is supposed to be a very low dependency component
import React, { useMemo } from 'react';
import UAParser from 'ua-parser-js';
import { supportedBrowsers } from './constants';

import Unsupported from './components/Unsupported';
import NoWebUSB from './components/NoWebUSB';
import Outdated from './components/Outdated';
import ChromeAndroid from './components/ChromeAndroid';

interface Props {
    children: any;
}

const BrowserDetect = ({ children }: Props) => {
    const ua = useMemo(() => new UAParser().getResult(), []);
    const supportedBrowser = useMemo(
        () => supportedBrowsers.find(b => b.name === ua.browser.name),
        [ua],
    );

    // Any iOS device: no WebUSB support (suggest to download iOS app?)
    if (ua.os.name === 'iOS') {
        return <NoWebUSB />;
    }

    const isMobile = ua.device.type === 'mobile';
    // Unsupported mobile browser: get Chrome for Android
    if (isMobile && (!supportedBrowser || (supportedBrowser && !supportedBrowser.mobile))) {
        return <ChromeAndroid />;
    }

    // Unsupported browser
    if (!supportedBrowser) {
        return <Unsupported />;
    }

    // Outdated browser: update Chrome / Firefox
    if (ua.browser.version && supportedBrowser.version > parseInt(ua.browser.version, 10)) {
        return <Outdated name={supportedBrowser.name} />;
    }

    return children;
};

export default BrowserDetect;
