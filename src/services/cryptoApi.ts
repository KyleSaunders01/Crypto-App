// src/services/cryptoApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'https://api.coingecko.com/api/v3';

export const cryptoApi = createApi({
    reducerPath: 'cryptoApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getCryptos: builder.query<any, { currency: string; page: number; perPage: number }>({
            query: ({ currency, page, perPage }) => ({
                url: `coins/markets`,
                params: {
                    vs_currency: currency,
                    order: 'market_cap_desc',
                    per_page: perPage,
                    page: page,
                },
            }),
        }),
        getCryptoDetails: builder.query<any, { coinId: string; currency: string }>({
            query: ({ coinId, currency }) => ({
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
        getGlobalCryptoStats: builder.query<any, string>({
            query: (currency) => ({
                url: `/global`,
                params: {
                    vs_currency: currency,
                },
            }),
        }),
        getCryptoHistory: builder.query<any, { coinId: string; timePeriod: string; currency: string }>({
            query: ({ coinId, timePeriod, currency }) => ({
                url: `coins/${coinId}/market_chart`,
                params: {
                    vs_currency: currency,
                    days: timePeriod,
                },
            }),
        }),
        getExchanges: builder.query<any, void>({
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
    useLazyGetCryptosQuery,
    useGetGlobalCryptoStatsQuery,
    useGetCryptoDetailsQuery,
    useGetCryptoHistoryQuery,
    useGetExchangesQuery,
} = cryptoApi;
