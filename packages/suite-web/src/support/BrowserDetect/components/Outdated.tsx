import React, { useMemo } from 'react';
import Body from './Body';

import { supportedBrowsers } from '../constants';

interface Props {
    name: string;
}

const Outdated = ({ name }: Props) => {
    const browser = useMemo(
        () => supportedBrowsers.find(b => b.name === name && b.update !== undefined),
        [name],
    );

    return (
        <Body
            title="Your browser is outdated"
            subtitle="Please update your browser to the latest version."
            button={`Update ${name}`}
            url={browser?.url}
        />
    );
};

export default Outdated;
