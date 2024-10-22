import React from 'react';
import {Row, Col, Card, Divider} from 'antd';

interface SkeletonLoaderProps {
    count: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({count}) => {
    return (
        <>


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
