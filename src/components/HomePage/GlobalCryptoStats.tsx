import { useSelector } from 'react-redux';
import { useGetGlobalCryptoStatsQuery } from '../../services/cryptoApi.ts';
import {Typography, Row, Result, Button, Divider} from 'antd';
import millify from 'millify';
import { currencySymbols } from '../../types/currencySymbols.ts';
import type { RootState } from '../../app/store.ts';
import CustomStatistic from '../CryptoDetails/CustomStatistic.tsx';

const GlobalCryptoStats = () => {
    const selectedCurrency = useSelector((state: RootState) => state.currency.selectedCurrency);
    const { data: globalStatsResponse, isFetching, error, refetch } = useGetGlobalCryptoStatsQuery(selectedCurrency);

    const currencySymbol = currencySymbols[selectedCurrency] || '';

    if (!isFetching && (error || !globalStatsResponse || !globalStatsResponse.data)) {
        return (
            <div className="error-container">
                <Result
                    status="error"
                    title="Failed to Load Data"
                    subTitle="Something went wrong while fetching the global crypto stats. Please try again."
                    extra={[
                        <Button key="retry" type="primary" onClick={() => refetch()}>
                            Retry
                        </Button>,
                    ]}
                />
            </div>
        );
    }

    const globalStats = globalStatsResponse?.data;
    const marketCap = Number(globalStats?.total_market_cap?.[selectedCurrency]) || 0;
    const volume = Number(globalStats?.total_volume?.[selectedCurrency]) || 0;
    const marketCapChange = Number(globalStats?.market_cap_change_percentage_24h_usd) || 0;
    const btcDominance = Number(globalStats?.market_cap_percentage?.btc) || 0;
    const ethDominance = Number(globalStats?.market_cap_percentage?.eth) || 0;
    const totalCryptocurrencies = Number(globalStats?.active_cryptocurrencies) || 0;
    const totalExchanges = Number(globalStats?.markets) || 0;

    return (
        <div className="global-crypto-stats">
            <Typography.Title level={2} className="heading">
                Global Cryptocurrency Statistics
            </Typography.Title>
            <Divider />
            <Row gutter={[32, 32]}>
                <CustomStatistic
                    title="Total Cryptocurrencies"
                    value={millify(totalCryptocurrencies, { precision: 2 })}
                    isLoading={isFetching}
                />
                <CustomStatistic
                    title="Total Exchanges"
                    value={millify(totalExchanges, { precision: 2 })}
                    isLoading={isFetching}
                />
                <CustomStatistic
                    title={`Total Market Cap (${selectedCurrency.toUpperCase()})`}
                    value={marketCap > 0 ? `${currencySymbol}${millify(marketCap, { precision: 2 })}` : 'N/A'}
                    isLoading={isFetching}
                />
                <CustomStatistic
                    title={`Total 24h Volume (${selectedCurrency.toUpperCase()})`}
                    value={volume > 0 ? `${currencySymbol}${millify(volume, { precision: 2 })}` : 'N/A'}
                    isLoading={isFetching}
                />
                <CustomStatistic
                    title="Bitcoin Dominance"
                    value={`${millify(btcDominance, { precision: 2 })}%`}
                    isLoading={isFetching}
                />
                <CustomStatistic
                    title="Ethereum Dominance"
                    value={`${millify(ethDominance, { precision: 2 })}%`}
                    isLoading={isFetching}
                />
                <CustomStatistic
                    title="Total Market Cap Change (24h)"
                    value={`${millify(marketCapChange, { precision: 2 })}%`}
                    isLoading={isFetching}
                />
            </Row>
            <Divider />
        </div>
    );
};

export default GlobalCryptoStats;
