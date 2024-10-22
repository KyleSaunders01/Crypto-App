import React, { useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Divider, Typography } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RootState } from '../../app/store';
import { useLazyGetCryptosQuery } from '../../services/cryptoApi';
import CryptoCard from './CryptoCard';
import SkeletonLoader from './SkeletonLoader';

interface CryptocurrenciesProps {
    limit?: number;
    showTitle?: boolean;
}

interface CryptocurrenciesState {
    cryptos: any[];
    page: number;
    errorMessage: string | null;
    hasMore: boolean;
}

const initialState: CryptocurrenciesState = {
    cryptos: [],
    page: 1,
    errorMessage: null,
    hasMore: true,
};

type Action =
    | { type: 'FETCH_SUCCESS'; payload: any[]; append: boolean }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'RESET_CRYPTOS' };

const cryptoReducer = (state: CryptocurrenciesState, action: Action): CryptocurrenciesState => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return {
                ...state,
                cryptos: action.append
                    ? [...state.cryptos, ...action.payload]
                    : action.payload,
                hasMore: action.payload.length > 0,
                errorMessage: null,
            };
        case 'FETCH_ERROR':
            return { ...state, errorMessage: action.payload, hasMore: false };
        case 'SET_PAGE':
            return { ...state, page: action.payload };
        case 'RESET_CRYPTOS':
            return { ...state, cryptos: [], page: 1, hasMore: true, errorMessage: null };
        default:
            return state;
    }
};

const Cryptocurrencies: React.FC<CryptocurrenciesProps> = ({ limit, showTitle = true }) => {
    const [state, dispatch] = useReducer(cryptoReducer, initialState);
    const selectedCurrency = useSelector((state: RootState) => state.currency.selectedCurrency);
    const [getCryptos, { isFetching }] = useLazyGetCryptosQuery();

    const fetchCryptos = async (page: number, append = false) => {
        try {
            const data = await getCryptos({ currency: selectedCurrency, page, perPage: 50 }).unwrap();
            dispatch({ type: 'FETCH_SUCCESS', payload: data, append });
        } catch {
            dispatch({ type: 'FETCH_ERROR', payload: 'Failed to load cryptocurrencies' });
        }
    };

    useEffect(() => {
        dispatch({ type: 'RESET_CRYPTOS' });
        fetchCryptos(1, false);
    }, [selectedCurrency]);

    const fetchMoreData = async () => {
        const nextPage = state.page + 1;
        fetchCryptos(nextPage, true);
        dispatch({ type: 'SET_PAGE', payload: nextPage });
    };

    const displayedCryptos = limit ? state.cryptos.slice(0, limit) : state.cryptos;

    return (
        <>
            {showTitle && (
                <>
                    <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: '16px' }}>
                        Cryptocurrencies
                    </Typography.Title>
                    <Divider />
                </>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
                {state.errorMessage ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Typography.Text type="danger">{state.errorMessage}</Typography.Text>
                    </div>
                ) : isFetching  ? (
                    <SkeletonLoader count={limit || 50}/>
                ) : (
                    <InfiniteScroll
                        dataLength={displayedCryptos.length}
                        next={fetchMoreData}
                        hasMore={limit ? displayedCryptos.length < limit : state.hasMore}
                        loader={displayedCryptos.length > 0 ? <SkeletonLoader count={8}/> : null}
                    >
                        <Row
                            gutter={[32, 32]}
                            className="crypto-card-container"
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                paddingBottom: displayedCryptos.length === 0 ? '50px' : '0',
                            }}
                        >
                            {displayedCryptos.length > 0 ? (
                                displayedCryptos.map((crypto) => (
                                    <Col xs={24} sm={12} lg={6} key={crypto.id}>
                                        <CryptoCard currency={crypto} selectedCurrency={selectedCurrency} />
                                    </Col>
                                ))
                            ) : (
                                !isFetching && (
                                    <Col span={24} style={{ textAlign: 'center', padding: '20px' }}>
                                        <p style={{ margin: 0, fontSize: '18px' }}>No cryptocurrencies found.</p>
                                    </Col>
                                )
                            )}
                        </Row>
                    </InfiniteScroll>
                )}
            </div>
        </>
    );
};

export default Cryptocurrencies;
