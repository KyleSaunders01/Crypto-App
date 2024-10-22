import React, { useState } from 'react';
import { Button, Menu, Typography, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import {
    HomeOutlined,
    MoneyCollectOutlined,
    FundOutlined,
    MenuOutlined,
    BankOutlined,
} from '@ant-design/icons';
import icon from '../../public/cryptoco.png';
import CurrencySelector from './CurrencySelector';

const Navbar: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const menuItems = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: <Link to="/">Home</Link>,
        },
        {
            key: 'cryptocurrencies',
            icon: <FundOutlined />,
            label: <Link to="/cryptocurrencies">Cryptocurrencies</Link>,
        },
        {
            key: 'exchanges',
            icon: <MoneyCollectOutlined />,
            label: <Link to="/exchanges">Exchanges</Link>,
        },
        {
            key: 'currency',
            icon: <BankOutlined />,
            label: 'Choose Currency',
            onClick: () => setIsModalVisible(true),
            className: 'currency-select',
        },
    ];

    return (
        <div className="nav-container">
            <div className="logo-container">
                <Avatar src={icon} size="large"/>
                <Typography.Title level={2} className="logo">
                    <Link to="/">Cryptoco</Link>
                </Typography.Title>
                <Button
                    className="menu-control-container"
                    onClick={() => setActiveMenu(!activeMenu)}
                >
                    <MenuOutlined/>
                </Button>
            </div>
            {activeMenu && (
                <Menu theme="dark" items={menuItems}/>
            )}
            <CurrencySelector
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
            />
        </div>
    );
};

export default Navbar;
