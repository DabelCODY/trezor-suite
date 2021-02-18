import React, { lazy, memo, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Loader } from '@trezor/components';

import routes from '../config/routes.json';

const ErrorPage = lazy(() => import('@suite-views/error'));
const components: { [key: string]: React.LazyExoticComponent<any> } = {
    '@dashboard-views': lazy(() => import('@dashboard-views')),
    '@suite-views/notifications': lazy(() => import('@suite-views/notifications')),
    '@passwords-views': lazy(() => import('@passwords-views')),
    '@portfolio-views': lazy(() => import('@portfolio-views')),
    '@suite-views/error': lazy(() => import('@suite-views/error')),

    '@wallet-views/transactions': lazy(() => import('@wallet-views/transactions')),
    '@wallet-views/receive': lazy(() => import('@wallet-views/receive')),
    '@wallet-views/details': lazy(() => import('@wallet-views/details')),
    '@wallet-views/send': lazy(() => import('@wallet-views/send')),
    '@wallet-views/sign-verify': lazy(() => import('@wallet-views/sign-verify')),

    '@wallet-views/coinmarket/buy': lazy(() => import('@wallet-views/coinmarket/buy')),
    '@wallet-views/coinmarket/buy/detail': lazy(
        () => import('@wallet-views/coinmarket/buy/detail'),
    ),
    '@wallet-views/coinmarket/buy/offers': lazy(
        () => import('@wallet-views/coinmarket/buy/offers'),
    ),
    '@wallet-views/coinmarket/exchange': lazy(() => import('@wallet-views/coinmarket/exchange')),
    '@wallet-views/coinmarket/exchange/detail': lazy(
        () => import('@wallet-views/coinmarket/exchange/detail'),
    ),
    '@wallet-views/coinmarket/exchange/offers': lazy(
        () => import('@wallet-views/coinmarket/exchange/offers'),
    ),
    '@wallet-views/coinmarket/spend': lazy(() => import('@wallet-views/coinmarket/spend')),
    '@wallet-views/coinmarket/redirect': lazy(() => import('@wallet-views/coinmarket/redirect')),

    '@settings-views': lazy(() => import('@settings-views')),
    '@settings-views/coins': lazy(() => import('@settings-views/coins')),
    '@settings-views/debug': lazy(() => import('@settings-views/debug')),
    '@settings-views/device': lazy(() => import('@settings-views/device')),
};

const AppRouter = () => (
    <Suspense fallback={<Loader size={64} />}>
        <Switch>
            {routes.map(route => (
                <Route
                    key={route.path}
                    path={process.env.assetPrefix + route.path}
                    exact={route.exact}
                    component={route.component ? components[route.component] : undefined}
                />
            ))}
            {/* 404 */}
            <Route path="*" component={ErrorPage} />
        </Switch>
    </Suspense>
);

export default memo(AppRouter);
