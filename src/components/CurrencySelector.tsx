// src/components/CurrencySelector.tsx

import React from 'react';
import { Modal, List, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrency } from '../app/currencySlice';
import type { RootState } from '../app/store';

const { Text } = Typography;

const currencies = [
    { code: 'zar', symbol: 'R', name: 'South African Rand' },
    { code: 'usd', symbol: '$', name: 'US Dollar' },
    { code: 'eur', symbol: '€', name: 'Euro' },
    { code: 'gbp', symbol: '£', name: 'British Pound' },
];

interface CurrencySelectorProps {
    isModalVisible: boolean;
    setIsModalVisible: (visible: boolean) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
                                                               isModalVisible,
                                                               setIsModalVisible,
                                                           }) => {
    const dispatch = useDispatch();
    const selectedCurrency = useSelector(
        (state: RootState) => state.currency.selectedCurrency
    );

    const handleCurrencyChange = (currencyCode: string) => {
        dispatch(setCurrency(currencyCode));
        setIsModalVisible(false);
    };

    return (
        <Modal
            title="Select Currency"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
        >
            <List
                dataSource={currencies}
                renderItem={(currency) => (
                    <List.Item
                        onClick={() => handleCurrencyChange(currency.code)}
                        style={{
                            cursor: 'pointer',
                            backgroundColor:
                                currency.code === selectedCurrency ? '#f0f0f0' : 'inherit',
                        }}
                    >
                        <Text strong>{currency.name}</Text> ({currency.symbol})
                    </List.Item>
                )}
            />
        </Modal>
    );
};

export default CurrencySelector;
