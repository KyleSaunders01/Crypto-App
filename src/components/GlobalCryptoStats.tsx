import { useSelector } from 'react-redux';
import { useGetGlobalCryptoStatsQuery } from '../services/cryptoApi.ts';
import { Typography, Row, Result, Button } from 'antd';
import millify from 'millify';
import { currencySymbols } from '../types/currencySymbols.ts';
import type { RootState } from '../app/store.ts';
import CustomStatistic from './CustomStatistic';

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
    const marketCap = globalStats?.total_market_cap?.[selectedCurrency] || 'N/A';
    const volume = globalStats?.total_volume?.[selectedCurrency] || 'N/A';
    const marketCapChange = globalStats?.market_cap_change_percentage_24h_usd || 'N/A';
    const btcDominance = globalStats?.market_cap_percentage?.btc ?? 'N/A';
    const ethDominance = globalStats?.market_cap_percentage?.eth ?? 'N/A';

    return (
        <div className="global-crypto-stats">
            <Typography.Title level={2} className="heading">
                Global Cryptocurrency Stats
            </Typography.Title>
            <Row gutter={[32, 32]}>
                <CustomStatistic
                    title="Total Cryptocurrencies"
                    value={millify(globalStats?.active_cryptocurrencies, { precision: 2 })}
                    isLoading={isFetching}
                />
                <CustomStatistic
                    title="Total Exchanges"
                    value={millify(globalStats?.markets, { precision: 2 })}
                    isLoading={isFetching}
                />
                <CustomStatistic
                    title={`Total Market Cap (${selectedCurrency.toUpperCase()})`}
                    value={marketCap !== 'N/A' ? `${currencySymbol}${millify(marketCap, { precision: 2 })}` : 'N/A'}
                    isLoading={isFetching}
                />
                <CustomStatistic
                    title={`Total 24h Volume (${selectedCurrency.toUpperCase()})`}
                    value={volume !== 'N/A' ? `${currencySymbol}${millify(volume, { precision: 2 })}` : 'N/A'}
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
        </div>
    );
};

export default GlobalCryptoStats;
