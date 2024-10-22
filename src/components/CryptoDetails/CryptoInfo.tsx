import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Typography, Skeleton, Result } from 'antd';
import { DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined, LineChartOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import HTMLReactParser from 'html-react-parser';
import { formatCurrency } from '../../utils/formatCurrency';
import { RootState } from '../../app/store';
import { useGetCryptoDetailsQuery } from '../../services/cryptoApi';
import { setCryptoDetails, setCryptoDetailsError } from "../../app/cryptoDetailsSlice.ts"

const { Title, Text } = Typography;

interface CryptoInfoProps {
    coinId: string;
}

const CryptoInfo: React.FC<CryptoInfoProps> = ({ coinId }) => {
    const selectedCurrency = useSelector(
        (state: RootState) => state.currency.selectedCurrency
    );
    const dispatch = useDispatch();

    const {
        data: cryptoDetailsData,
        isFetching: isFetchingDetails,
        error: errorDetails,
    } = useGetCryptoDetailsQuery({ coinId, currency: selectedCurrency });


    useEffect(() => {
        if (cryptoDetailsData) {
            dispatch(setCryptoDetails({ coinId, details: cryptoDetailsData }));
        } else if (errorDetails) {
            dispatch(setCryptoDetailsError('Failed to fetch crypto details'));
        }
    }, [cryptoDetailsData, errorDetails, coinId, dispatch]);

    if (errorDetails) {
        return (
            <Result
                status="error"
                title="Failed to Load Coin Details"
                subTitle="There was an issue fetching the details of this coin."
            />
        );
    }

    const cryptoDetails = cryptoDetailsData?.market_data || {};
    const tickers = cryptoDetailsData?.tickers || [];
    const selectedCurrencyLower = selectedCurrency.toLowerCase();

    const numberOfMarkets =
        tickers.length > 0
            ? new Set(
                tickers.map(
                    (ticker: { base: string; target: string }) =>
                        `${ticker.base}/${ticker.target}`
                )
            ).size
            : 'N/A';

    const numberOfExchanges =
        tickers.length > 0
            ? new Set(
                tickers.map(
                    (ticker: { market: { name: string } }) => ticker.market.name
                )
            ).size
            : 'N/A';

    const stats = [
        {
            title: 'Price',
            value: cryptoDetails?.current_price?.[selectedCurrencyLower]
                ? formatCurrency(
                    cryptoDetails?.current_price?.[selectedCurrencyLower],
                    selectedCurrency
                )
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
            value: cryptoDetails?.total_volume?.[selectedCurrencyLower]
                ? formatCurrency(
                    cryptoDetails?.total_volume?.[selectedCurrencyLower],
                    selectedCurrency
                )
                : 'N/A',
            icon: <ThunderboltOutlined />,
        },
        {
            title: 'Market Cap',
            value: cryptoDetails?.market_cap?.[selectedCurrencyLower]
                ? formatCurrency(
                    cryptoDetails?.market_cap?.[selectedCurrencyLower],
                    selectedCurrency
                )
                : 'N/A',
            icon: <DollarCircleOutlined />,
        },
        {
            title: 'All-time-high (ATH)',
            value: cryptoDetails?.ath?.[selectedCurrencyLower]
                ? formatCurrency(
                    cryptoDetails?.ath?.[selectedCurrencyLower],
                    selectedCurrency
                )
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
        {
            title: 'Number of Markets',
            value: numberOfMarkets,
            icon: <FundOutlined />,
        },
        {
            title: 'Number of Exchanges',
            value: numberOfExchanges,
            icon: <MoneyCollectOutlined />,
        },
        {
            title: 'Approved Supply',
            value: cryptoDetails?.total_supply ? <CheckOutlined /> : <StopOutlined />,
            icon: <ExclamationCircleOutlined />,
        },
        {
            title: 'Total Supply',
            value: cryptoDetails?.total_supply
                ? formatCurrency(cryptoDetails?.total_supply, selectedCurrency)
                : 'N/A',
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

    return (
        <>
            {isFetchingDetails ? (
                <>
                    <Col className="stats-container">
                        <Col className="coin-value-statistics wide-columns">
                            <Col className="coin-value-statistics-heading">
                                <div className="skeleton rank-title-skeleton-lg"></div>
                                <br />
                                <p className="skeleton line-skeleton"></p>
                                <p className="skeleton line-skeleton-med"></p>
                            </Col>
                            {[...Array(6)].map((_, index) => (
                                <Col className="coin-stats" key={index}>
                                    <Col className="coin-stats-name">
                                        <Skeleton.Avatar active size="small" shape="circle" />
                                        <Skeleton.Input style={{ width: 100 }} active size="small" />
                                    </Col>
                                    <Skeleton.Input style={{ width: 150 }} active size="small" />
                                </Col>
                            ))}
                        </Col>

                        <Col className="other-stats-info">
                            <Col className="coin-value-statistics-heading wide-columns">
                                <div className="skeleton rank-title-skeleton-lg"></div>
                                <br />
                                <p className="skeleton line-skeleton"></p>
                            </Col>
                            {[...Array(5)].map((_, index) => (
                                <Col className="coin-stats" key={index}>
                                    <Col className="coin-stats-name">
                                        <Skeleton.Avatar active size="small" shape="circle" />
                                        <Skeleton.Input style={{ width: 100 }} active size="small" />
                                    </Col>
                                    <Skeleton.Input style={{ width: 150 }} active size="small" />
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
                            <Skeleton active paragraph={{ rows: 4 }} />
                        </Row>
                        <Col className="coin-links">
                            <div className="skeleton rank-title-skeleton-lg"></div>
                            <Row className="coin-link">
                                <Title level={5} className="link-name">
                                    Website
                                </Title>
                                <Skeleton.Input style={{ width: 200 }} active size="small" />
                            </Row>
                        </Col>
                    </Col>
                </>
            ) : (
                <>
                    <Col className="stats-container">
                        <Col className="coin-value-statistics">
                            <Col className="coin-value-statistics-heading">
                                <Title level={3} className="coin-details-heading">
                                    {cryptoDetailsData?.name} Value Statistics
                                </Title>
                                <p>
                                    An overview showing the statistics of {cryptoDetailsData?.name}, such as the base and
                                    quote currency, rank, and trading volume.
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
                                <Title level={3} className="coin-details-heading">
                                    Other Stats Info
                                </Title>
                                <p>
                                    An overview showing the statistics of {cryptoDetailsData?.name}, such as markets and
                                    supply.
                                </p>
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
                            <Title level={3} className="coin-details-heading">
                                {cryptoDetailsData?.name} Links
                            </Title>
                            <Row className="coin-link">
                                <Title level={5} className="link-name">
                                    Website
                                </Title>
                                <a
                                    href={cryptoDetailsData?.links?.homepage[0]}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {cryptoDetailsData?.links?.homepage[0]}
                                </a>
                            </Row>
                        </Col>
                    </Col>
                </>
            )}
        </>
    );
};

export default CryptoInfo;
