import React from 'react';

interface Props {
    children?: React.ReactNode;
    title: string;
    subtitle: string;
    button?: string;
    url?: string;
}

const Body = ({ children, title, subtitle, button, url }: Props) => (
    <div
        style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            background: '#fff',
            zIndex: 99999,
            textAlign: 'center',
            paddingTop: '150px',
        }}
    >
        <h1
            style={{
                textRendering: 'optimizeLegibility',
                color: '#494949',
                fontWeight: 'bold',
                margin: 0,
                padding: 0,
                fontSize: '2rem',
                paddingBottom: '10px',
            }}
        >
            {title}
        </h1>
        <p
            style={{
                fontSize: '1rem',
                lineHeight: 1.8,
                color: '#757575',
                padding: 0,
                margin: 0,
            }}
        >
            {subtitle}
        </p>
        {button && url && (
            <a
                href={url}
                target="_blank"
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
                rel="noopener noreferrer"
            >
                {button}
            </a>
        )}
        {children}
    </div>
);

export default Body;
