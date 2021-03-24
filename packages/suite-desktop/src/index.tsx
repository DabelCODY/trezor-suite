import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { Router } from 'react-router-dom';
import TrezorConnect from 'trezor-connect';

import { store } from '@suite/reducers/store';
import { isDev } from '@suite-utils/build';
import { SENTRY_CONFIG } from '@suite-config';

import * as Sentry from '@sentry/browser';
import Metadata from '@suite-components/Metadata';
import Preloader from '@suite-components/Preloader';
import ToastContainer from '@suite-components/ToastContainer';
import IntlProvider from '@suite-support/ConnectedIntlProvider';
import Resize from '@suite-support/Resize';
import Tor from '@suite-support/Tor';
import OnlineStatus from '@suite-support/OnlineStatus';
import ErrorBoundary from '@suite-support/ErrorBoundary';
import RouterHandler from '@suite-support/Router';
import ThemeProvider from '@suite-support/ThemeProvider';
import history from '@suite/support/history';

import AppRouter from './support/Router';
import GlobalStyles from '@suite-support/styles/global';

const Main = () => {
    useEffect(() => {
        if (!window.Cypress && !isDev()) {
            Sentry.init(SENTRY_CONFIG);
            Sentry.configureScope(scope => {
                scope.setTag('version', process.env.VERSION || 'undefined');
            });
        }
        if (window.Cypress) {
            // exposing ref to TrezorConnect allows us to mock its methods in cypress tests
            window.TrezorConnect = TrezorConnect;
        }
    }, []);

    return (
        <ReduxProvider store={store}>
            <ThemeProvider>
                <Router history={history}>
                    <GlobalStyles />
                    <ErrorBoundary>
                        <Resize />
                        <Tor />
                        <OnlineStatus />
                        <RouterHandler />
                        <IntlProvider>
                            <>
                                {/*
                                    just because we need make trezor-connect render the iframe
                                */}
                                <div
                                    className="trezor-webusb-button"
                                    style={{
                                        width: '100%',
                                        position: 'absolute',
                                        top: '-1000px',
                                    }}
                                />
                                <Metadata />
                                <ToastContainer />
                                <Preloader>
                                    <AppRouter />
                                </Preloader>
                            </>
                        </IntlProvider>
                    </ErrorBoundary>
                </Router>
            </ThemeProvider>
        </ReduxProvider>
    );
};

render(<Main />, document.getElementById('app'));
