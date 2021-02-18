import React from 'react';
import { supportedBrowsers } from '../constants';

import Body from './Body';

const browsers = supportedBrowsers.filter(b => b.url !== undefined);

const Unsupported = () => {
    return (
        <Body
            title="Your browser is not supported"
            subtitle="Please choose one of the supported browsers"
        >
            <div
                style={{
                    width: '300px',
                    margin: '15px auto',
                }}
            >
                {browsers.map(browser => (
                    <div
                        style={{
                            float: 'left',
                            width: '50%',
                            textAlign: 'center',
                        }}
                    >
                        <img src={browser.icon} alt={browser.name} height="56px" />
                        <div style={{ display: 'block' }}>
                            <a
                                href={browser.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    marginTop: '10px',
                                    position: 'relative',
                                    alignItems: 'center',
                                    padding: '11px 24px',
                                    textAlign: 'center',
                                    borderRadius: '3px',
                                    fontSize: '1rem',
                                    fontWeight: 300,
                                    cursor: 'pointer',
                                    outline: 'none',
                                    background: '#01B757',
                                    color: '#FFFFFF',
                                    border: '1px solid #01B757',
                                    justifyContent: 'center',
                                }}
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
