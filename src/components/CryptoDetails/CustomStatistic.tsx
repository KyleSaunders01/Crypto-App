import React from 'react';
import { Typography, Col, Skeleton } from 'antd';

interface CustomStatisticProps {
    title: string;
    value: string | number | null;
    isLoading: boolean;
}

const CustomStatistic: React.FC<CustomStatisticProps> = ({
                                                             title,
                                                             value,
                                                             isLoading,
                                                         }) => {
    return (
        <Col xs={12} md={6} lg={6}>
            <div className="custom-statistic">
                <Typography.Title level={4} style={{ fontSize: '1.2rem' }}>
                    {title}
                </Typography.Title>
                {isLoading ? (
                    <Skeleton.Input style={{ width: 150 }} active={true} size="default" />
                ) : (
                    <Typography.Text
                        style={{ color: 'grey', fontSize: '1.5rem' }}
                    >
                        {value ? value : 'N/A'}
                    </Typography.Text>
                )}
            </div>
        </Col>
    );
};

export default CustomStatistic;
