import React, { useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Divider, Typography } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RootState } from '../../app/store';
import { useLazyGetCryptosQuery } from '../../services/cryptoApi';
import CryptoCard from './CryptoCard';
import SearchBar from './SearchBar';
import SkeletonLoader from './SkeletonLoader';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

interface CryptocurrenciesProps {
    limit?: number;
    showSearchAndTitle?: boolean;
}

interface CryptocurrenciesState {
    cryptos: any[];
    page: number;
    searchTerm: string;
    errorMessage: string | null;
    hasMore: boolean;
}

const initialState: CryptocurrenciesState = {
    cryptos: [],
    page: 1,
    searchTerm: '',
    errorMessage: null,
    hasMore: true,
};

type Action =
    | { type: 'FETCH_SUCCESS'; payload: any[]; append: boolean }
    | { type: 'SET_SEARCH_TERM'; payload: string }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'RESET_CRYPTOS' };

const cryptoReducer = (state: CryptocurrenciesState, action: Action): CryptocurrenciesState => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return {
                ...state,
                cryptos: action.append
                    ? [...state.cryptos, ...action.payload] // Append new data for subsequent pages
                    : action.payload, // Replace data when fetching the first page
                hasMore: action.payload.length > 0,
            };
        case 'SET_SEARCH_TERM':
            return { ...state, searchTerm: action.payload };
        case 'FETCH_ERROR':
            return { ...state, errorMessage: action.payload, hasMore: false };
        case 'SET_PAGE':
            return { ...state, page: action.payload };
        case 'RESET_CRYPTOS':
            return { ...state, cryptos: [], page: 1, hasMore: true };
        default:
            return state;
    }
};

const Cryptocurrencies: React.FC<CryptocurrenciesProps> = ({ limit, showSearchAndTitle = true }) => {
    const [state, dispatch] = useReducer(cryptoReducer, initialState);
    const selectedCurrency = useSelector((state: RootState) => state.currency.selectedCurrency);

    const [getCryptos, { isFetching }] = useLazyGetCryptosQuery();
    const debouncedSearchTerm = useDebouncedValue(state.searchTerm, 300);

    const fetchCryptos = async (page: number, append = false) => {
        try {
            const data = await getCryptos({ currency: selectedCurrency, page, perPage: 50 }).unwrap();
            dispatch({ type: 'FETCH_SUCCESS', payload: data, append });
        } catch {
            dispatch({ type: 'FETCH_ERROR', payload: 'Failed to load cryptocurrencies' });
        }
    };

    // Fetch data when currency changes or initial load
    useEffect(() => {
        dispatch({ type: 'RESET_CRYPTOS' }); // Reset state when currency or initial load changes
        fetchCryptos(1, false); // Fetch first page and reset data
    }, [selectedCurrency]);

    // Debounce search term
    useEffect(() => {
        if (debouncedSearchTerm) {
            dispatch({ type: 'SET_SEARCH_TERM', payload: debouncedSearchTerm });
        }
    }, [debouncedSearchTerm]);

    const fetchMoreData = async () => {
        const nextPage = state.page + 1;
        fetchCryptos(nextPage, true); // Append data for subsequent pages
        dispatch({ type: 'SET_PAGE', payload: nextPage });
    };

    // Limit displayed cryptocurrencies when `limit` is provided
    const displayedCryptos = limit ? state.cryptos.slice(0, limit) : state.cryptos;

    if (isFetching && state.page === 1) {
        return <SkeletonLoader count={limit || 50} />;
    }

    return (
        <>
            {showSearchAndTitle && (
                <>
                    <Typography.Title level={2} style={{ textAlign: 'center' }}>
                        Cryptocurrencies
                    </Typography.Title>
                    <Divider />
                    <SearchBar onSearch={(value) => dispatch({ type: 'SET_SEARCH_TERM', payload: value })} />
                </>
            )}
            <InfiniteScroll
                dataLength={displayedCryptos.length}
                next={fetchMoreData}
                hasMore={limit ? displayedCryptos.length < limit : state.hasMore}
                loader={<SkeletonLoader count={8} />}
            >
                <Row gutter={[32, 32]} className="crypto-card-container">
                    {displayedCryptos.length > 0 ? (
                        displayedCryptos.map((crypto) => (
                            <Col xs={24} sm={12} lg={6} key={crypto.id}>
                                <CryptoCard currency={crypto} selectedCurrency={selectedCurrency} />
                            </Col>
                        ))
                    ) : (
                        <p>No cryptocurrencies found.</p>
                    )}
                </Row>
            </InfiniteScroll>
        </>
    );
};

export default Cryptocurrencies;
