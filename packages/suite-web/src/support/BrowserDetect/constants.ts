import iconChrome from './images/browser-chrome.png';
import iconFirefox from './images/browser-firefox.png';

export const supportedBrowsers = [
    {
        name: 'Chrome',
        version: 69,
        mobile: true,
        icon: iconChrome,
        url: 'https://www.google.com/chrome/',
        update:
            'https://support.google.com/chrome/answer/95414?co=GENIE.Platform%3DDesktop&amp;hl=en',
    },
    {
        name: 'Chromium',
        version: 69,
        mobile: true,
        update:
            'https://support.google.com/chrome/answer/95414?co=GENIE.Platform%3DDesktop&amp;hl=en',
    },
    {
        name: 'Firefox',
        version: 62,
        mobile: false, // no webusb support
        icon: iconFirefox,
        url: 'https://www.mozilla.org/firefox/',
        update: 'https://support.mozilla.org/en-US/kb/update-firefox-latest-release',
    },
];
