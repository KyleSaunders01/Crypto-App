import millify from 'millify';
import { currencySymbols } from '../types/currencySymbols';

export const formatCurrency = (value: number, currency: string) => {
    const symbol = currencySymbols[currency] || '';
    // If the value is larger than 1000, format using millify
    if (value >= 1000) {
        return `${symbol}${millify(value, { precision: 2 })}`;
    }

    // For smaller values, just format with symbol and two decimals
    return `${symbol}${value.toFixed(2)}`;
};
