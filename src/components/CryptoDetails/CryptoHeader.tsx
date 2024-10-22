import React from 'react';
import { useSelector } from 'react-redux';
import { Col, Typography } from 'antd';
import { RootState } from '../../app/store';

const { Title } = Typography;

interface CryptoHeaderProps {
    coinId: string;
}

const CryptoHeader: React.FC<CryptoHeaderProps> = ({ coinId }) => {
    const selectedCurrency = useSelector(
        (state: RootState) => state.currency.selectedCurrency
    );

    const cryptoDetailsData = useSelector(
        (state: RootState) => state.cryptoDetails.details[coinId]
    );

    if (!cryptoDetailsData) {
        return (
            <Col className="coin-heading-container">
                <div className="skeleton rank-title-skeleton-lg"></div>
                <br />
                <p className="skeleton line-skeleton"></p>
                <p className="skeleton line-skeleton-med"></p>
            </Col>
        );
    }

    return (
        <Col className="coin-heading-container">
            <Title level={2} className="coin-name">
                {cryptoDetailsData?.name} ({cryptoDetailsData?.symbol?.toUpperCase()})
            </Title>
            <p>
                {cryptoDetailsData?.name} live price in {selectedCurrency.toUpperCase()}. View value
                statistics, market cap, and supply.
            </p>
        </Col>
    );
};

export default CryptoHeader;
