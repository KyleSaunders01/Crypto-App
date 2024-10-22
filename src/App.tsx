import { Routes, Route, Link } from 'react-router-dom';
import {Layout, Typography, Space, Avatar} from 'antd';
import './App.css'
import { Navbar, Exchanges, HomePage, Cryptocurrencies, CryptoDetails } from './components';
import icon from "../public/cryptoco.png";
function App() {

  return (
    <div className="app">
        <div className="navbar">
            <Navbar/>
        </div>
        <div className="main">
            <Layout>
                <div className="routes">
                    <Routes>
                        <Route path="/Crypto-App/" element={<HomePage/>}/>
                        <Route path="/exchanges" element={<Exchanges/>}/>
                        <Route path="/cryptocurrencies" element={<Cryptocurrencies/>}/>
                        <Route path="/crypto/:coinId" element={<CryptoDetails/>}/>
                    </Routes>
                </div>
            </Layout>
            <div className="footer">

                <Avatar src={icon} size="small"/>
                <Typography.Title level={5} style={{color: 'white', textAlign: 'center'}}>
                    Cryptoco <br/>
                </Typography.Title>
                <Space>
                    <Link to="/">Home</Link>
                    <Link to="/cryptocurrencies">Cryptocurrencies</Link>
                    <Link to="/exchanges">Exchanges</Link>
                </Space>
            </div>
        </div>

    </div>
  )
}

export default App
