import React, { lazy, Suspense } from 'react';
import { render } from 'react-dom';
import BrowserDetect from './support/BrowserDetect';

const Main = lazy(() => import('./Main'));
const Index = () => (
    <BrowserDetect>
        <Suspense fallback={<div />}>
            <Main />
        </Suspense>
    </BrowserDetect>
);

render(<Index />, document.getElementById('app'));
