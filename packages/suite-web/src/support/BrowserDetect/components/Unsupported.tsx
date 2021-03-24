import React from 'react';
import { supportedBrowsers } from '../constants';

import Body from './Body';
import style from '../browser-detect.css';

const browsers = supportedBrowsers.filter(b => b.url !== undefined);

const Unsupported = () => {
    return (
        <Body
            title="Your browser is not supported"
            subtitle="Please choose one of the supported browsers"
        >
            <div className={style.browsers}>
                {browsers.map(browser => (
                    <div className={style.browser}>
                        <img src={browser.icon} alt={browser.name} height="56px" />
                        <div className={style.download}>
                            <a
                                href={browser.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={style.button}
                            >
                                Get {browser.name}
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </Body>
    );
};

export default Unsupported;
