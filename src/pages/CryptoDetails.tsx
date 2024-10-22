import React from 'react';
import { useParams } from 'react-router-dom';
import { Col, Result, Divider } from 'antd';
import CryptoInfo from '../components/CryptoDetails/CryptoInfo';
import LineChart from '../components/CryptoDetails/LineChart';
import CryptoHeader from "../components/CryptoDetails/CryptoHeader.tsx";

const CryptoDetails: React.FC = () => {
    const { coinId } = useParams<{ coinId: string }>();

    if (!coinId) {
        return (
            <Result
                status="404"
                title="Coin Not Found"
                subTitle="The coin you are looking for does not exist."
            />
        );
    }

    return (
        <Col className="coin-detail-container">
            <CryptoHeader coinId={coinId} />
            <LineChart coinId={coinId} />
            <CryptoInfo coinId={coinId} />
            <Divider />

        </Col>
    );
};

export default CryptoDetails;
