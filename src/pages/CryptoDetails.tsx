import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import HTMLReactParser from 'html-react-parser';
import { useParams } from 'react-router-dom';
import { Col, Row, Typography, Select, Spin, Result } from 'antd';
import {
    MoneyCollectOutlined,
    DollarCircleOutlined,
    FundOutlined,
    ExclamationCircleOutlined,
    StopOutlined,
    TrophyOutlined,
    CheckOutlined,
    NumberOutlined,
    ThunderboltOutlined,
    LineChartOutlined,
} from '@ant-design/icons';
import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi.ts';
import millify from 'millify'; // for formatting large numbers
import LineChart from '../components/LineChart.tsx';
import {RootState} from "../app/store.ts";


const { Title, Text } = Typography;
const { Option } = Select;

const CryptoDetails: React.FC = () => {
    const { coinId } = useParams<{ coinId: string }>();
    const selectedCurrency = useSelector(
        (state: RootState) => state.currency.selectedCurrency
    );
    const [timePeriod, setTimePeriod] = useState<string>(() =>{
        return localStorage.getItem('selectedTimePeriod') || '7d';
    });

    useEffect(() => {
        localStorage.setItem('selectedTimePeriod', timePeriod);
    }, [timePeriod]);

    const {
        data: cryptoDetailsData,
        isFetching: isFetchingDetails,
        error: errorDetails,
    } = useGetCryptoDetailsQuery({ coinId: coinId!, currency: selectedCurrency });


    const {
        data: coinHistoryData,
        isFetching: isFetchingHistory,
        error: errorHistory,
    } = useGetCryptoHistoryQuery({ coinId: coinId!, timePeriod, currency: selectedCurrency });

    useEffect(() => {
        console.log('coinHistoryData:', coinHistoryData);
    }, [coinHistoryData]);

    if (isFetchingDetails || isFetchingHistory) {
        return <Spin size="large" tip="Loading crypto details..." />;
    }

    if (errorDetails || errorHistory) {
        return (
            <Result
                status="error"
                title="Failed to Load Coin Details"
                subTitle="There was an issue fetching the details of this coin."
            />
        );
    }

    const cryptoDetails = cryptoDetailsData?.market_data || {};
    const coinHistory = coinHistoryData || { prices: [] };

    // Logic to format values based on the selected currency
    const formatValue = (value: number | undefined) => {
        return value ? millify(value, { precision: 2 }) : 'N/A';
    };


    // **New Code to Calculate Number of Markets and Exchanges**
    const tickers = cryptoDetailsData?.tickers || [];

    // Calculate number of unique markets (trading pairs)
    const numberOfMarkets = tickers.length > 0
        ? new Set(tickers.map((ticker: { base: string; target: string }) => `${ticker.base}/${ticker.target}`)).size
        : 'N/A';

    // Calculate number of unique exchanges
    const numberOfExchanges = tickers.length > 0
        ? new Set(tickers.map((ticker: { market: { name: string } }) => ticker.market.name)).size
        : 'N/A';

    // Stats array with change percentage and other data
    const stats = [
        { title: 'Price', value: `$${formatValue(cryptoDetails?.current_price?.[selectedCurrency])}`, icon: <DollarCircleOutlined /> },
        { title: 'Rank', value: cryptoDetailsData?.market_cap_rank || 'N/A', icon: <NumberOutlined /> },
        { title: '24h Volume', value: `$${formatValue(cryptoDetails?.total_volume?.[selectedCurrency])}`, icon: <ThunderboltOutlined /> },
        { title: 'Market Cap', value: `$${formatValue(cryptoDetails?.market_cap?.[selectedCurrency])}`, icon: <DollarCircleOutlined /> },
        { title: 'All-time-high (ATH)', value: `$${formatValue(cryptoDetails?.ath?.[selectedCurrency])}`, icon: <TrophyOutlined /> },
        { title: '24h Change', value: `${cryptoDetails?.price_change_percentage_24h?.toFixed(2) || 'N/A'}%`, icon: <LineChartOutlined /> },
    ];

    const genericStats = [
        { title: 'Number of Markets', value: numberOfMarkets, icon: <FundOutlined /> },
        { title: 'Number of Exchanges', value: numberOfExchanges, icon: <MoneyCollectOutlined /> },
        { title: 'Approved Supply', value: cryptoDetails?.total_supply ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
        { title: 'Total Supply', value: formatValue(cryptoDetails?.total_supply), icon: <ExclamationCircleOutlined /> },
        { title: 'Circulating Supply', value: formatValue(cryptoDetails?.circulating_supply), icon: <ExclamationCircleOutlined /> },
    ];

    const timeOptions = [
        { label: '24h', value: '1' },
        { label: '7d', value: '7' },
        { label: '14d', value: '14' },
        { label: '30d', value: '30' },
        { label: '90d', value: '90' },
        { label: '180d', value: '180' },
        { label: '1y', value: '365' },
    ];


    return (
        <Col className="coin-detail-container">
            <Col className="coin-heading-container">
                <Title level={2} className="coin-name">
                    {cryptoDetailsData?.name} ({cryptoDetailsData?.symbol?.toUpperCase()}) Price
                </Title>
                <p>{cryptoDetailsData?.name} live price in {selectedCurrency.toUpperCase()}. View value statistics, market cap, and supply.</p>
            </Col>

            <Select
                defaultValue={timePeriod}
                className="select-timeperiod"
                onChange={(value) => setTimePeriod(value)}
            >
                {timeOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                        {option.label}
                    </Option>
                ))}
            </Select>

            <LineChart
                coinHistory={coinHistory}
                currentPrice={formatValue(cryptoDetails?.current_price?.[selectedCurrency])}
                coinName={cryptoDetailsData?.name || 'Unknown'}
                change={cryptoDetails?.price_change_percentage_24h || 0}
                timePeriod={timePeriod}
            />

            <Col className="stats-container">
                <Col className="coin-value-statistics">
                    <Col className="coin-value-statistics-heading">
                        <Title level={3} className="coin-details-heading">{cryptoDetailsData?.name} Value Statistics</Title>
                        <p>An overview showing the statistics of {cryptoDetailsData?.name}, such as the base and quote currency, rank, and trading volume.</p>
                    </Col>
                    {stats.map(({ icon, title, value }) => (
                        <Col className="coin-stats" key={title}>
                            <Col className="coin-stats-name">
                                <Text>{icon}</Text>
                                <Text>{title}</Text>
                            </Col>
                            <Text className="stats">{value}</Text>
                        </Col>
                    ))}
                </Col>

                <Col className="other-stats-info">
                    <Col className="coin-value-statistics-heading">
                        <Title level={3} className="coin-details-heading">Other Stats Info</Title>
                        <p>An overview showing the statistics of {cryptoDetailsData?.name}, such as markets and supply.</p>
                    </Col>
                    {genericStats.map(({ icon, title, value }) => (
                        <Col className="coin-stats" key={title}>
                            <Col className="coin-stats-name">
                                <Text>{icon}</Text>
                                <Text>{title}</Text>
                            </Col>
                            <Text className="stats">{value}</Text>
                        </Col>
                    ))}
                </Col>
            </Col>

            <Col className="coin-desc-link">
                <Row className="coin-desc">
                    <Title level={3} className="coin-details-heading">What is {cryptoDetailsData?.name}?</Title>
                    {HTMLReactParser(cryptoDetailsData?.description?.en || '')}
                </Row>
                <Col className="coin-links">
                    <Title level={3} className="coin-details-heading">{cryptoDetailsData?.name} Links</Title>
                    <Row className="coin-link">
                        <Title level={5} className="link-name">Website</Title>
                        <a href={cryptoDetailsData?.links?.homepage[0]} target="_blank" rel="noreferrer">
                            {cryptoDetailsData?.links?.homepage[0]}
                        </a>
                    </Row>
                </Col>
            </Col>
        </Col>
    );
};

export default CryptoDetails;
