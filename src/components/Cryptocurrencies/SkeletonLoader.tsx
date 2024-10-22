import React from 'react';
import {Row, Col, Card, Divider, Typography} from 'antd';

interface SkeletonLoaderProps {
    count: number;
    showSearchAndTitle: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({count, showSearchAndTitle}) => {
    return (
        <>
            {showSearchAndTitle && (
                <>
                    <Typography.Title level={2} style={{textAlign: 'center'}}>
                        Cryptocurrencies
                    </Typography.Title>
                    <Divider/>
                    <div className="search-skeleton-wrapper">
                        <div className="search-skeleton skeleton"></div>
                    </div>
                </>
            )}

            <Row gutter={[32, 32]} className="crypto-card-container">
                {Array.from({length: count}).map((_, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card hoverable>
                            <div className="crypto-card-header">
                                <div className="rank-title-skeleton skeleton"></div>
                                <div className="avatar-skeleton skeleton"></div>
                            </div>
                            <Divider/>
                            <div className="crypto-card-body">
                                <div className="line-skeleton-short skeleton"></div>
                                <div className="line-skeleton-med skeleton"></div>
                                <div className="line-skeleton skeleton"></div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

        </>
    );
};

export default SkeletonLoader;
