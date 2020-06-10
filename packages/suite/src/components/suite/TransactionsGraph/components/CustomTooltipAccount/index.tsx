import React from 'react';
import { FormattedNumber } from '@suite-components';
import { Account } from '@wallet-types';
import { TooltipProps } from 'recharts';
import { Props as GraphProps, CryptoGraphProps } from '../../index';
import CustomTooltipBase from '../CustomTooltipBase';

interface Props extends TooltipProps {
    selectedRange: GraphProps['selectedRange'];
    localCurrency: string;
    symbol: Account['symbol'];
    sentValueFn: CryptoGraphProps['sentValueFn'];
    receivedValueFn: CryptoGraphProps['receivedValueFn'];
}

const formatAmount = (
    amount: string | undefined,
    symbol: string,
    fiatAmount?: string,
    localCurrency?: string,
) => (
    <>
        {amount} {symbol.toUpperCase()}
        {fiatAmount && localCurrency && (
            <>
                {' '}
                (
                <FormattedNumber currency={localCurrency} value={fiatAmount} />)
            </>
        )}
    </>
);

const CustomTooltipAccount = (props: Props) => {
    if (props.active && props.payload) {
        const receivedAmountString = props.receivedValueFn(props.payload[0].payload);
        const sentAmountString = props.sentValueFn(props.payload[0].payload);

        const receivedFiat: string | undefined =
            props.payload[0].payload.receivedFiat[props.localCurrency] ?? undefined;
        const sentFiat: string | undefined =
            props.payload[0].payload.sentFiat[props.localCurrency] ?? undefined;

        return (
            <CustomTooltipBase
                {...props}
                selectedRange={props.selectedRange}
                sentAmount={formatAmount(
                    receivedAmountString,
                    props.symbol,
                    sentFiat,
                    props.localCurrency,
                )}
                receivedAmount={formatAmount(
                    sentAmountString,
                    props.symbol,
                    receivedFiat,
                    props.localCurrency,
                )}
            />
        );
    }

    return null;
};

export default CustomTooltipAccount;