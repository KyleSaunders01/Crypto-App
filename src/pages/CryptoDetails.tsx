import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {Col, Typography, Result, Divider} from 'antd';
import { useGetCryptoDetailsQuery } from '../services/cryptoApi.ts';
import LineChart from '../components/CryptoDetails/LineChart.tsx';
import { RootState } from '../app/store.ts';
import CryptoInfo from "../components/CryptoDetails/CryptoInfo.tsx";

const { Title} = Typography;


const CryptoDetails: React.FC = () => {
    const { coinId } = useParams<{ coinId: string }>();
    const selectedCurrency = useSelector(
        (state: RootState) => state.currency.selectedCurrency
    );


    const {
        data: cryptoDetailsData,
        isFetching: isFetchingDetails,
        error: errorDetails,
    } = useGetCryptoDetailsQuery({ coinId: coinId!, currency: selectedCurrency });

    const cryptoDetails = cryptoDetailsData?.market_data || {};


    if (isFetchingDetails) {
        return (
            <Col className="coin-detail-container">
                <Col className="coin-heading-container wide-section">
                    <div className="skeleton rank-title-skeleton-xl"></div>
                    <p className="skeleton line-skeleton"></p>
                </Col>

                <LineChart
                    coinId={""}
                    coinName={""}
                />

                <Divider/>

                <CryptoInfo
                    cryptoDetailsData={null}
                    cryptoDetails={null}
                    selectedCurrency={selectedCurrency}
                    isFetchingDetails={true}
                />
            </Col>
        );
    }

    if (errorDetails) {
        return (
            <Result
                status="error"
                title="Failed to Load Coin Details"
                subTitle="There was an issue fetching the details of this coin."
            />
        );
    }

    return (
        <Col className="coin-detail-container">
            <Col className="coin-heading-container">
                <Title level={2} className="coin-name">
                    {cryptoDetailsData?.name} ({cryptoDetailsData?.symbol?.toUpperCase()}) Price
                </Title>
                <p>{cryptoDetailsData?.name} live price in {selectedCurrency.toUpperCase()}. View value statistics, market cap, and supply.</p>
            </Col>

            <LineChart
                coinId={coinId!}
                coinName={cryptoDetailsData?.name || 'Unknown'}
            />

            <Divider/>

            <CryptoInfo
                cryptoDetailsData={cryptoDetailsData}
                cryptoDetails={cryptoDetails}
                selectedCurrency={selectedCurrency}
                isFetchingDetails={isFetchingDetails}
            />
        </Col>
    );
};

export default CryptoDetails;
