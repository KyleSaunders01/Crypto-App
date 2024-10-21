import React from 'react';
import millify from 'millify';
import { Collapse, Row, Col, Typography, Avatar, Skeleton, Result, Button, Divider } from 'antd';
import HTMLReactParser from 'html-react-parser';

import { useGetExchangesQuery } from '../services/cryptoApi.ts';
import { Exchange } from "../types/exchange.ts";

const { Text, Title } = Typography;
const { Panel } = Collapse;

const Exchanges: React.FC = () => {
    const { data: exchangesList, isFetching, error, refetch } = useGetExchangesQuery();

    // Loading state
    if (isFetching) {
        return (
            <>
                <Typography.Title level={2} style={{ textAlign: 'center' }}>
                    Exchanges
                </Typography.Title>
                <Divider />
                <Row style={{ marginBottom: '16px' }}>
                    <Col span={6}>
                        <Title level={4} style={{ textTransform: 'uppercase' }}>Exchanges</Title>
                    </Col>
                    <Col span={6}>
                        <Title level={4} style={{ textTransform: 'uppercase' }}>24h Trade Volume (BTC)</Title>
                    </Col>
                    <Col span={6}>
                        <Title level={4} style={{ textTransform: 'uppercase' }}>Country</Title>
                    </Col>
                    <Col span={6}>
                        <Title level={4} style={{ textTransform: 'uppercase' }}>Trust Score</Title>
                    </Col>
                </Row>
                <Row>
                    {Array.from({ length: 20 }).map((_, index) => (
                        <Col span={24} key={index}>
                            <Collapse>
                                <Panel
                                    key={index}
                                    showArrow={false}
                                    header={(
                                        <Row key={index}>
                                            <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
                                                <Skeleton.Avatar active size="large" />
                                                <Skeleton.Input active style={{ width: 150, marginLeft: 16, height: 20 }} />
                                            </Col>
                                            <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
                                                <Skeleton.Input active style={{ width: 100, height: 20 }} />
                                            </Col>
                                            <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
                                                <Skeleton.Input active style={{ width: 100, height: 20 }} />
                                            </Col>
                                            <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
                                                <Skeleton.Input active style={{ height: 20 }} />
                                            </Col>
                                        </Row>
                                    )}
                                >
                                    <Skeleton active paragraph={{ rows: 3 }} />
                                </Panel>
                            </Collapse>
                        </Col>
                    ))}
                </Row>
            </>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="error-container">
                <Result
                    status="error"
                    title="Failed to Load Exchanges"
                    subTitle="Something went wrong while fetching the exchanges data. Please try again."
                    extra={[
                        <Button key="retry" type="primary" onClick={() => refetch()}>
                            Retry
                        </Button>,
                    ]}
                />
            </div>
        );
    }

    return (
        <>
            <Typography.Title level={2} style={{ textAlign: 'center' }}>
                Exchanges
            </Typography.Title>
            <Divider />
            <Row style={{ marginBottom: '16px' }}>
                <Col span={6}>
                    <Title level={4} style={{ textTransform: 'uppercase' }}>Exchanges</Title>
                </Col>
                <Col span={6}>
                    <Title level={4} style={{ textTransform: 'uppercase' }}>24h Trade Volume (BTC)</Title>
                </Col>
                <Col span={6}>
                    <Title level={4} style={{ textTransform: 'uppercase' }}>Country</Title>
                </Col>
                <Col span={6}>
                    <Title level={4} style={{ textTransform: 'uppercase' }}>Trust Score</Title>
                </Col>
            </Row>
            <Row>
                {exchangesList?.map((exchange: Exchange) => (
                    <Col span={24} key={exchange.id}>
                        <Collapse>
                            <Panel
                                key={exchange.id}
                                showArrow={false}
                                header={(
                                    <Row key={exchange.id}>
                                        <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Text><strong>{exchange.trust_score_rank}.</strong></Text>
                                            <Avatar className="exchange-image" src={exchange.image} style={{ marginLeft: '8px' }} />
                                            <Text style={{ marginLeft: '8px' }}><strong>{exchange.name}</strong></Text>
                                        </Col>
                                        <Col span={6}>{millify(exchange.trade_volume_24h_btc)} BTC</Col>
                                        <Col span={6}>{exchange.country || 'N/A'}</Col>
                                        <Col span={6}>{exchange.trust_score}</Col>
                                    </Row>
                                )}
                            >
                                {HTMLReactParser(exchange.description || '<p>No description available.</p>')}
                            </Panel>
                        </Collapse>
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default Exchanges;
