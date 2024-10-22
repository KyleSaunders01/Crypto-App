import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { Cryptocurrencies } from '../components'
import GlobalCryptoStats from '../components/HomePage/GlobalCryptoStats.tsx';

const { Title } = Typography;

const HomePage = () => {
    return (
        <>
            <GlobalCryptoStats />

            <div className="home-heading-container">
                <Title level={2} className="home-title">
                    Top 10 Cryptocurrencies
                </Title>
                <Title level={3} className="show-more">
                    <Link to="/cryptocurrencies">Show More</Link>
                </Title>
            </div>


            <Cryptocurrencies limit={10} showSearchAndTitle={false}/>
        </>
    );
};

export default HomePage;
