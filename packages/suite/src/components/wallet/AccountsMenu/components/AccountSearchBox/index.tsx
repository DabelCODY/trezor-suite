import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme, Icon, Input, CoinLogo } from '@trezor/components';
import { useSelector, useAccountSearch } from '@suite-hooks';
import { useKeyPress } from '@suite-utils/dom';

const Wrapper = styled.div`
    background: ${props => props.theme.BG_WHITE};
    width: 100%;
    margin-top: 16px;
`;

const CoinsFilter = styled.div`
    display: flex;
    padding-top: 16px;
    flex-wrap: wrap;
`;

const OuterCircle = styled.div<{ isSelected?: boolean; isMobile?: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3px;
    background: ${props => props.theme.BG_WHITE};
    border-radius: 50%;
    border: 2px solid ${props => (props.isSelected ? props.theme.BG_GREEN : 'transparent')};
    transition: all 0.3;
    cursor: pointer;

    margin-bottom: 8px;
    margin-right: ${props => (props.isMobile ? '12px' : '4px')};
`;

const InputWrapper = styled.div<{ showCoinFilter: boolean }>`
    ${props =>
        !props.showCoinFilter &&
        css`
            /* additional space under input if we are not showing coin filter */
            /* one could think why not to remove a margin from coin filter so it can be here regardless of whether coin filter is shown */
            /* but hold your horses, it is actually essential there is top PADDING on coin filter as a click to the area triggers deactivating the filter */
            margin-bottom: 12px;
        `}
`;

const StyledInput = styled(Input)`
    && {
        background-color: ${props => props.theme.BG_GREY_ALT};
        border: none;
    }
`;

const StyledCoinLogo = styled(CoinLogo)<{
    isSelected?: boolean;
    filterActivated?: boolean;
}>`
    ${props =>
        props.filterActivated &&
        css`
            opacity: ${props.isSelected ? '1' : '0.5'};
        `}
`;

const SearchIconWrapper = styled.div``;

interface Props {
    isMobile?: boolean;
}

const AccountSearchBox = (props: Props) => {
    const theme = useTheme();
    const { coinFilter, setCoinFilter, searchString, setSearchString } = useAccountSearch();
    const { enabledNetworks, device } = useSelector(state => ({
        enabledNetworks: state.wallet.settings.enabledNetworks,
        device: state.suite.device,
    }));
    const controlPressed = useKeyPress('Control');

    const unavailableCapabilities = device?.unavailableCapabilities ?? {};
    const supportedNetworks = enabledNetworks.filter(symbol => !unavailableCapabilities[symbol]);

    const showCoinFilter = supportedNetworks.length > 1;

    const onClear = () => {
        setSearchString(undefined);
        setCoinFilter([]);
    };

    return (
        <Wrapper>
            <InputWrapper showCoinFilter={showCoinFilter}>
                <StyledInput
                    value={searchString ?? ''}
                    onChange={e => {
                        setSearchString(e.target.value);
                    }}
                    innerAddon={
                        <SearchIconWrapper>
                            <Icon icon="SEARCH" size={16} color={theme.TYPE_DARK_GREY} />
                        </SearchIconWrapper>
                    }
                    addonAlign="left"
                    textIndent={[16, 12]}
                    variant="small"
                    placeholder="Search"
                    noTopLabel
                    noError
                    clearButton
                    onClear={onClear}
                    data-test="@account-menu/search-input"
                />
            </InputWrapper>
            {showCoinFilter && (
                <CoinsFilter
                    onClick={() => {
                        setCoinFilter([]);
                    }}
                >
                    {supportedNetworks.map(n => (
                        <OuterCircle
                            key={n}
                            isMobile={props.isMobile}
                            isSelected={coinFilter.includes(n)}
                            onClick={e => {
                                e.stopPropagation();
                                // remove if already selected
                                if (coinFilter.includes(n)) {
                                    const updatedFilter = coinFilter.filter(c => c !== n);
                                    return setCoinFilter(updatedFilter);
                                }
                                // add if control key is pressed
                                if (controlPressed && coinFilter) {
                                    setCoinFilter([...coinFilter, n]);
                                    // or simply select
                                } else {
                                    setCoinFilter([n]);
                                }
                            }}
                        >
                            <StyledCoinLogo
                                symbol={n}
                                size={props.isMobile ? 24 : 16}
                                filterActivated={!!coinFilter.length}
                                isSelected={coinFilter.includes(n)}
                            />
                        </OuterCircle>
                    ))}
                </CoinsFilter>
            )}
        </Wrapper>
    );
};

export default AccountSearchBox;
