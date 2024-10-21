// services/cryptoApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Exchange } from '../types/exchange';

const baseUrl = 'https://api.coingecko.com/api/v3';

export const cryptoApi = createApi({
    reducerPath: 'cryptoApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getCryptos: builder.query<Crypto[], { currency: string; page: number; perPage: number }>({
            query: ({ currency, page, perPage }) => `coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}`,
        }),
        getCryptoDetails: builder.query({
            query: ({
                        coinId,
                        currency,
                    }: {
                coinId: string;
                currency: string;
            }) => ({
                url: `coins/${coinId}`,
                params: {
                    vs_currency: currency,
                    tickers: true,
                    market_data: true,
                    community_data: true,
                    developer_data: true,
                    localization: false,
                    sparkline: false,
                },
            }),
        }),
        getGlobalCryptoStats: builder.query({
            query: (currency: string) => `/global?vs_currency=${currency}`,
        }),
        getCryptoHistory: builder.query({
            query: ({
                        coinId,
                        timePeriod,
                        currency,
                    }: {
                coinId: string;
                timePeriod: string;
                currency: string;
            }) => ({
                url: `coins/${coinId}/market_chart`,
                params: {
                    vs_currency: currency,
                    days: timePeriod,
                },
            }),
        }),
        getExchanges: builder.query<Exchange[], void>({
            query: () => ({
                url: '/exchanges',
                params: {
                    per_page: 100,
                    page: 1,
                },
            }),
        }),
    }),
});

export const {
    useLazyGetCryptosQuery, // Add this line
    useGetGlobalCryptoStatsQuery,
    useGetCryptoDetailsQuery,
    useGetCryptoHistoryQuery,
    useGetExchangesQuery,
} = cryptoApi;
