// src/app/currencySlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrencyState {
    selectedCurrency: string;
}

const initialState: CurrencyState = {
    selectedCurrency: 'zar',
};

const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setSelectedCurrency(state, action: PayloadAction<string>) {
            state.selectedCurrency = action.payload;
        },
    },
});

export const { setSelectedCurrency } = currencySlice.actions;

export default currencySlice.reducer;
