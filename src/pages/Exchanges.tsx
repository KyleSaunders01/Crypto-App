import React from 'react';
import millify from 'millify';
import { Collapse, Row, Col, Typography, Avatar, Spin, Result, Button } from 'antd';
import HTMLReactParser from 'html-react-parser';

import { useGetExchangesQuery } from '../services/cryptoApi.ts';
import {Exchange} from "../types/exchange.ts";


const { Text } = Typography;
const { Panel } = Collapse;

const Exchanges: React.FC = () => {
    const { data: exchangesList, isFetching, error, refetch } = useGetExchangesQuery();

    // Loading state
    if (isFetching) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Loading exchanges..." />
            </div>
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
            <Row>
                <Col span={6}><strong>Exchanges</strong></Col>
                <Col span={6}><strong>24h Trade Volume (BTC)</strong></Col>
                <Col span={6}><strong>Country</strong></Col>
                <Col span={6}><strong>Trust Score</strong></Col>
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
                                        <Col span={6}>
                                            <Text><strong>{exchange.trust_score_rank}.</strong></Text>
                                            <Avatar className="exchange-image" src={exchange.image} />
                                            <Text><strong>{exchange.name}</strong></Text>
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
