import { configureStore } from '@reduxjs/toolkit';
import { cryptoApi } from '../services/cryptoApi';
import currencyReducer from './currencySlice';
import cryptoDetailsReducer from './cryptoDetailsSlice';

const store = configureStore({
    reducer: {
        currency: currencyReducer,
        cryptoDetails: cryptoDetailsReducer,
        [cryptoApi.reducerPath]: cryptoApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(cryptoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

