import React from 'react';
import { Col, Row, Skeleton, Typography } from 'antd';
import {
    DollarCircleOutlined,
    FundOutlined,
    ExclamationCircleOutlined,
    StopOutlined,
    TrophyOutlined,
    CheckOutlined,
    NumberOutlined,
    ThunderboltOutlined,
    LineChartOutlined,
    MoneyCollectOutlined,
} from '@ant-design/icons';
import HTMLReactParser from 'html-react-parser';
import { formatCurrency } from '../../utils/formatCurrency'; // Importing formatCurrency utility

const { Title, Text } = Typography;

interface CryptoInfoProps {
    cryptoDetailsData: any;
    cryptoDetails: any;
    selectedCurrency: string;
    isFetchingDetails: boolean;
}

const CryptoInfo: React.FC<CryptoInfoProps> = ({
                                                   cryptoDetailsData,
                                                   cryptoDetails,
                                                   selectedCurrency,
                                                   isFetchingDetails,
                                               }) => {
    const tickers = cryptoDetailsData?.tickers || [];
    const numberOfMarkets = tickers.length > 0
        ? new Set(tickers.map((ticker: { base: string; target: string }) => `${ticker.base}/${ticker.target}`)).size
        : 'N/A';

    const numberOfExchanges = tickers.length > 0
        ? new Set(tickers.map((ticker: { market: { name: string } }) => ticker.market.name)).size
        : 'N/A';

    const stats = [
        {
            title: 'Price',
            value: cryptoDetails?.current_price?.[selectedCurrency]
                ? formatCurrency(cryptoDetails?.current_price?.[selectedCurrency], selectedCurrency)
                : 'N/A',
            icon: <DollarCircleOutlined />,
        },
        {
            title: 'Rank',
            value: cryptoDetailsData?.market_cap_rank || 'N/A',
            icon: <NumberOutlined />,
        },
        {
            title: '24h Volume',
            value: cryptoDetails?.total_volume?.[selectedCurrency]
                ? formatCurrency(cryptoDetails?.total_volume?.[selectedCurrency], selectedCurrency)
                : 'N/A',
            icon: <ThunderboltOutlined />,
        },
        {
            title: 'Market Cap',
            value: cryptoDetails?.market_cap?.[selectedCurrency]
                ? formatCurrency(cryptoDetails?.market_cap?.[selectedCurrency], selectedCurrency)
                : 'N/A',
            icon: <DollarCircleOutlined />,
        },
        {
            title: 'All-time-high (ATH)',
            value: cryptoDetails?.ath?.[selectedCurrency]
                ? formatCurrency(cryptoDetails?.ath?.[selectedCurrency], selectedCurrency)
                : 'N/A',
            icon: <TrophyOutlined />,
        },
        {
            title: '24h Change',
            value: `${cryptoDetails?.price_change_percentage_24h?.toFixed(2) || 'N/A'}%`,
            icon: <LineChartOutlined />,
        },
    ];

    const genericStats = [
        { title: 'Number of Markets', value: numberOfMarkets, icon: <FundOutlined /> },
        { title: 'Number of Exchanges', value: numberOfExchanges, icon: <MoneyCollectOutlined /> },
        {
            title: 'Approved Supply',
            value: cryptoDetails?.total_supply ? <CheckOutlined /> : <StopOutlined />,
            icon: <ExclamationCircleOutlined />,
        },
        {
            title: 'Total Supply',
            value: cryptoDetails?.total_supply ? formatCurrency(cryptoDetails?.total_supply, selectedCurrency) : 'N/A',
            icon: <ExclamationCircleOutlined />,
        },
        {
            title: 'Circulating Supply',
            value: cryptoDetails?.circulating_supply
                ? formatCurrency(cryptoDetails?.circulating_supply, selectedCurrency)
                : 'N/A',
            icon: <ExclamationCircleOutlined />,
        },
    ];

    if (isFetchingDetails) {
        return (
            <>
                <br />
                <Col className="stats-container">
                    <Col className="coin-value-statistics wide-columns">
                        <Col className="coin-value-statistics-heading">
                            <div className="skeleton rank-title-skeleton-lg"></div>
                            <br />
                            <p className="skeleton line-skeleton"></p>
                            <p className="skeleton line-skeleton-med"></p>
                        </Col>
                        {stats.map(({ icon, title }) => (
                            <Col className="coin-stats" key={title}>
                                <Col className="coin-stats-name">
                                    <Text>{icon}</Text>
                                    <Text>{title}</Text>
                                </Col>
                                <div className="skeleton line-skeleton-short"></div>
                            </Col>
                        ))}
                    </Col>

                    <Col className="other-stats-info">
                        <Col className="coin-value-statistics-heading wide-columns">
                            <div className="skeleton rank-title-skeleton-lg"></div>
                            <br />
                            <p className="skeleton line-skeleton"></p>
                        </Col>
                        {genericStats.map(({ icon, title }) => (
                            <Col className="coin-stats" key={title}>
                                <Col className="coin-stats-name">
                                    <Text>{icon}</Text>
                                    <Text>{title}</Text>
                                </Col>
                                <div className="skeleton line-skeleton-sml"></div>
                            </Col>
                        ))}
                    </Col>
                </Col>

                <Col className="coin-desc-link">
                    <Row className="coin-desc">
                        <div className="skeleton rank-title-skeleton-lg"></div>
                        <br />
                        <br />
                        <br />
                        <Skeleton title={true} />
                        <Skeleton title={true} />
                        <Skeleton title={true} />
                    </Row>
                    <Col className="coin-links">
                        <div className="skeleton rank-title-skeleton-lg"></div>
                        <Row className="coin-link">
                            <Title level={5} className="link-name">
                                Website
                            </Title>
                            <div className="skeleton line-skeleton-short"></div>
                        </Row>
                    </Col>
                </Col>
            </>
        );
    }

    return (
        <>
            <Col className="stats-container">
                <Col className="coin-value-statistics">
                    <Col className="coin-value-statistics-heading">
                        <Title level={3} className="coin-details-heading">
                            {cryptoDetailsData?.name} Value Statistics
                        </Title>
                        <p>
                            An overview showing the statistics of {cryptoDetailsData?.name}, such as the base and quote currency, rank,
                            and trading volume.
                        </p>
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
                    <Title level={3} className="coin-details-heading">
                        What is {cryptoDetailsData?.name}?
                    </Title>
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
        </>
    );
};

export default CryptoInfo;
