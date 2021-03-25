import React from 'react';

import style from '../browser-detect.css';

interface Props {
    children?: React.ReactNode;
    title: string;
    subtitle: string;
    button?: string;
    url?: string;
}

const Body = ({ children, title, subtitle, button, url }: Props) => (
    <div className={style.container} data-test="@browser-detect">
        <h1 className={style.title}>{title}</h1>
        <p className={style.subtitle}>{subtitle}</p>
        {button && url && (
            <a href={url} target="_blank" rel="noopener noreferrer" className={style.button}>
                {button}
            </a>
        )}
        {children}
    </div>
);

export default Body;
