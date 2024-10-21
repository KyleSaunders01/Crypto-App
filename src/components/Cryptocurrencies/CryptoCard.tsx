import React from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import { Crypto } from '../../types/crypto';
import { formatCurrency } from '../../utils/formatCurrency';

interface CryptoCardProps {
    currency: Crypto;
    selectedCurrency: string;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ currency, selectedCurrency }) => {
    return (
        <Link to={`/crypto/${currency.id}`}>
            <Card
                title={`${currency.market_cap_rank}. ${currency.name}`}
                extra={<img className="crypto-image" src={currency.image} alt={currency.name} />}
                hoverable
            >
                <p>Price: {formatCurrency(currency.current_price, selectedCurrency)}</p>
                <p>Market Cap: {formatCurrency(currency.market_cap, selectedCurrency)}</p>
                <p>Daily Change: {currency.price_change_percentage_24h}%</p>
            </Card>
        </Link>
    );
};

export default CryptoCard;
