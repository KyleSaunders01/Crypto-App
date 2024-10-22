// src/features/crypto/cryptoSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CryptoDetailsState {
    details: Record<string, any>; // Store details by coinId
    error: string | null;
}

const initialState: CryptoDetailsState = {
    details: {},
    error: null,
};

const cryptoDetailsSlice = createSlice({
    name: 'cryptoDetails',
    initialState,
    reducers: {
        setCryptoDetails(state, action: PayloadAction<{ coinId: string; details: any }>) {
            state.details[action.payload.coinId] = action.payload.details;
        },
        setCryptoDetailsError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
    },
});

export const { setCryptoDetails, setCryptoDetailsError } = cryptoDetailsSlice.actions;
export default cryptoDetailsSlice.reducer;
