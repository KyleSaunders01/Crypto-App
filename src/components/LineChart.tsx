import React from 'react';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { Col, Row, Typography } from 'antd';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Title as ChartTitle,
    TimeScale,
    ChartOptions
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import millify from 'millify';
import { RootState } from '../app/store.ts';
import { currencySymbols } from "../types/currencySymbols.ts";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, ChartTitle, TimeScale);

const { Title } = Typography;

interface LineChartProps {
    coinHistory: {
        prices: number[][];
    };
    currentPrice: string;
    coinName: string;
    change: number;
    timePeriod: string;
}

const LineChart: React.FC<LineChartProps> = ({ coinHistory, currentPrice, coinName, change, timePeriod }) => {
    const coinPrice: number[] = [];
    const coinTimestamp: Date[] = [];

    const selectedCurrency = useSelector((state: RootState) => state.currency.selectedCurrency);

    const currencySymbol = currencySymbols[selectedCurrency.toLowerCase()] || selectedCurrency.toUpperCase();

    const timePeriodInHours = timePeriod === '24h' ? 24 : timePeriod === '7d' ? 7 * 24 : timePeriod === '30d' ? 30 * 24 : Infinity;

    for (let i = 0; i < coinHistory.prices.length; i++) {
        const [timestamp, price] = coinHistory.prices[i];
        coinPrice.push(price);

        const utcDate = new Date(timestamp);
        coinTimestamp.push(utcDate);
    }

    const data = {
        labels: coinTimestamp,
        datasets: [
            {
                label: `Price of ${coinName} in ${currencySymbol}`,
                data: coinPrice,
                fill: false,
                backgroundColor: '#0071bd',
                borderColor: '#0071bd',
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        scales: {
            x: {
                type: 'time', // Ensure the x-axis is time-based
                time: {
                    tooltipFormat: 'yyyy-MM-dd HH:mm', // Adjust tooltip to show date and time
                    unit: timePeriodInHours === 24 ? 'hour' : 'day', // 'hour' for 24h, 'day' for 7d or more
                },
                ticks: {
                    source: 'auto', // Must be one of 'auto' | 'data' | 'labels' | undefined
                    autoSkip: true,
                    maxTicksLimit: timePeriodInHours === 24 ? 24 : timePeriodInHours <= 7 * 24 ? 7 : 12,
                },
            },
            y: {
                beginAtZero: false,
            },
        },
    };

    return (
        <>
            <Row className="chart-header">
                <Title level={2} className="chart-title">
                    {coinName} Price Chart ({currencySymbol})
                </Title>
                <Col className="price-container">
                    <Title level={5} className="price-change">
                        Change: {millify(change, { precision: 2 })}%
                    </Title>
                    <Title level={5} className="current-price">
                        Current {coinName} Price: {currencySymbol}{currentPrice}
                    </Title>
                </Col>
            </Row>
            <Line data={data} options={options} />
        </>
    );
};

export default LineChart;
