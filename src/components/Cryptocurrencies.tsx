import React, { useState, useEffect } from "react";
import millify from "millify";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { Card, Row, Col, Button, Result, Input } from "antd";
import { useGetCryptosQuery } from "../services/cryptoApi.ts";
import { Crypto } from "../types/crypto.ts";
import Fuse from "fuse.js";
import {RootState} from "../app/store.ts";
import {currencySymbols} from "../types/currencySymbols.ts";  // Import Fuse.js for fuzzy searching

// Function to format the currency values dynamically
const formatCurrency = (value: number, currency: string) => {
    const symbol = currencySymbols[currency] || '';
    return `${symbol}${millify(value)}`;
};

interface CryptocurrenciesProps {
    limit?: number;
}

const Cryptocurrencies: React.FC<CryptocurrenciesProps> = ({ limit }) => {
    const selectedCurrency = useSelector(
        (state: RootState) => state.currency.selectedCurrency
    );
    const {
        data: cryptosList,
        isFetching,
        error,
        refetch
    } = useGetCryptosQuery(selectedCurrency);
    const [cryptos, setCryptos] = useState<Crypto[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fuse.js options configuration for fuzzy search
    const fuseOptions = {
        keys: ['name', 'symbol'],  // Search by name and symbol
        threshold: 0.3,  // Controls fuzziness (0 = exact, 1 = very fuzzy)
    };



    useEffect(() => {
        if (cryptosList) {
            let filteredData = cryptosList;

            if (searchTerm) {
                // Create a Fuse instance and perform fuzzy search
                const fuse = new Fuse(cryptosList, fuseOptions);
                const result = fuse.search(searchTerm);
                filteredData = result.map(({ item }) => item);  // Extract actual data from result
            }

            setCryptos(filteredData);
        }
    }, [cryptosList, searchTerm]);

    useEffect(() => {
        if (cryptosList) {
            const limitedCryptos = limit ? cryptosList.slice(0, limit) : cryptosList;
            setCryptos(limitedCryptos);
        }
    }, [cryptosList, limit]);

    // Display skeleton loaders when fetching
    const renderSkeletons = (count: number) => {
        return (
            <>
                <div className="search-skeleton-wrapper">
                    <div className="search-skeleton skeleton"></div>
                </div>
                <Row gutter={[32, 32]} className="crypto-card-container">
                    {Array.from({length: count}).map((_, index) => (
                        <Col xs={24} sm={12} lg={6} className="crypto-card" key={index}>
                            <Card hoverable>
                                <div className="crypto-card-header">
                                    <div className="rank-title-skeleton skeleton"></div>
                                    <div className="avatar-skeleton skeleton"></div>
                                </div>
                                <div className="crypto-card-body">
                                    <div className="line-skeleton skeleton"></div>
                                    <div className="line-skeleton skeleton"></div>
                                    <div className="line-skeleton skeleton"></div>
                                </div>

                            </Card>
                        </Col>
                    ))}
                </Row></>
        );
    };

    if (isFetching) {
        return renderSkeletons(limit || 100);
    }

    // Error state
    if (error) {
        return (
            <div className="error-container">
                <Result
                    status="error"
                    title="Failed to Load Cryptocurrencies"
                    subTitle="Something went wrong while fetching the cryptocurrency data. Please try again."
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

            <div className="search-crypto">
                <Input
                    placeholder="Search Cryptocurrency"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <Row gutter={[32, 32]} className="crypto-card-container">
                {cryptos?.length > 0 ? (
                    cryptos.map((currency) => (
                        <Col xs={24} sm={12} lg={6} className="crypto-card" key={currency.id}>
                            <Link to={`/crypto/${currency.id}`}>
                                <Card
                                    title={`${currency.market_cap_rank}. ${currency.name}`}
                                    extra={<img className="crypto-image" src={currency.image} alt={currency.name} />}
                                    hoverable
                                >
                                    <p>Price: {formatCurrency(currency.current_price, selectedCurrency)}</p>
                                    <p>Market Cap: {formatCurrency(currency.market_cap, selectedCurrency)}</p>
                                    <p>Daily Change: {currency.price_change_percentage_24h}%</p>
                                </Card>
                            </Link>
                        </Col>
                    ))
                ) : (
                    <p>No cryptocurrencies found.</p>
                )}
            </Row>
        </>
    );
};

export default Cryptocurrencies;
