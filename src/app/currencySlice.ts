import { createSlice } from '@reduxjs/toolkit';

interface CurrencyState {
    selectedCurrency: string;
}

const initialState: CurrencyState = {
    selectedCurrency: 'zar', // Default currency
};

const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setCurrency(state, action) {
            state.selectedCurrency = action.payload;
        },
    },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;