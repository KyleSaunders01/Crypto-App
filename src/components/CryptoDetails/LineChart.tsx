import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { Col, Row, Typography, Select, Result } from 'antd';
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
    ChartOptions,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import millify from 'millify';
import { RootState } from '../../app/store';
import { currencySymbols } from '../../types/currencySymbols';
import { useGetCryptoHistoryQuery, useGetCryptoDetailsQuery } from '../../services/cryptoApi';

const { Option } = Select;
const { Title } = Typography;

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, ChartTitle, TimeScale);

interface LineChartProps {
    coinId: string;
    coinName: string;
}

const LineChart: React.FC<LineChartProps> = ({ coinId, coinName }) => {
    const selectedCurrency = useSelector((state: RootState) => state.currency.selectedCurrency);
    const currencySymbol = currencySymbols[selectedCurrency.toLowerCase()] || selectedCurrency.toUpperCase();

    const [timePeriod, setTimePeriod] = useState<string>(() => localStorage.getItem('selectedTimePeriod') || '7');
    const [dataType, setDataType] = useState<string>('price');

    useEffect(() => {
        localStorage.setItem('selectedTimePeriod', timePeriod);
    }, [timePeriod]);

    const timeOptions = [
        { label: '24hrs', value: '1' },
        { label: '7 days', value: '7' },
        { label: '14 days', value: '14' },
        { label: '1 month', value: '30' },
        { label: '3 months', value: '90' },
        { label: '6 months', value: '180' },
        { label: '1 year', value: '365' },
    ];

    const timePeriodInHours = timePeriod === '1' ? 24 : Number(timePeriod) * 24;

    const { data: coinHistoryData, isFetching: isFetchingHistory, error } = useGetCryptoHistoryQuery({
        coinId,
        timePeriod,
        currency: selectedCurrency,
    });

    const { data: coinDetailsData, isFetching: isFetchingDetails } = useGetCryptoDetailsQuery({
        coinId,
        currency: selectedCurrency,
    });

    if (isFetchingHistory || isFetchingDetails) {
        return (
            <div className="custom-skeleton-container">
                <br />
                <div className="skeleton-select-dropdown"></div>

                <Row className="chart-header">
                    <div className="skeleton-title"></div>
                    <Col className="skeleton-stats">
                        <div className="skeleton-stats-item"></div>
                        <div className="skeleton-stats-item"></div>
                    </Col>
                </Row>

                <div className="skeleton-chart"></div>
            </div>
        );
    }

    if (error) {
        return (
            <Result
                status="error"
                title="Failed to Load Historical Data"
                subTitle="There was an issue fetching the historical data for this coin."
            />
        );
    }

    const coinTimestamp: Date[] = coinHistoryData.prices.map(([timestamp]: [number, number]) => new Date(timestamp));

// Extract data based on dataType
    let dataValues: number[] = [];
    let dataLabel: string = '';

    if (dataType === 'price') {
        dataValues = coinHistoryData.prices.map(([, value]: [number, number]) => value);
        dataLabel = `Price of ${coinName} in ${currencySymbol}`;
    } else if (dataType === 'market_cap') {
        dataValues = coinHistoryData.market_caps.map(([, value]: [number, number]) => value);
        dataLabel = `Market Cap of ${coinName} in ${currencySymbol}`;
    } else if (dataType === 'total_volume') {
        dataValues = coinHistoryData.total_volumes.map(([, value]: [number, number]) => value);
        dataLabel = `Total Volume of ${coinName} in ${currencySymbol}`;
    }

    // Calculate data change
    const dataChange = ((dataValues[dataValues.length - 1] - dataValues[0]) / dataValues[0]) * 100;

    // Get current value
    let currentValue = '';
    if (dataType === 'price') {
        currentValue = coinDetailsData?.market_data?.current_price?.[selectedCurrency.toLowerCase()] || '';
    } else if (dataType === 'market_cap') {
        currentValue = coinDetailsData?.market_data?.market_cap?.[selectedCurrency.toLowerCase()] || '';
    } else if (dataType === 'total_volume') {
        currentValue = coinDetailsData?.market_data?.total_volume?.[selectedCurrency.toLowerCase()] || '';
    }

    const data = {
        labels: coinTimestamp,
        datasets: [
            {
                label: dataLabel,
                data: dataValues,
                fill: false,
                backgroundColor: '#0071bd',
                borderColor: '#0071bd',
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true, // Make sure the chart is responsive
        maintainAspectRatio: false, // Allow it to fill the container dynamically
        scales: {
            x: {
                type: 'time',
                time: {
                    tooltipFormat: 'yyyy-MM-dd HH:mm',
                    unit: timePeriodInHours === 24 ? 'hour' : 'day',
                },
                ticks: {
                    source: 'auto',
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
        <div>
            <Select
                defaultValue={timePeriod}
                className="select-timeperiod"
                onChange={(value) => setTimePeriod(value)}
                size="middle"
            >
                {timeOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                        {option.label}
                    </Option>
                ))}
            </Select>
            <Select
                defaultValue={dataType}
                className="select-datatype"
                onChange={(value) => setDataType(value)}
                size="middle"
                style={{ marginLeft: '10px' }}
            >
                <Option value="price">Price</Option>
                <Option value="market_cap">Market Cap</Option>
                <Option value="total_volume">Volume</Option>
            </Select>
            <br />
            <br />
            <Row className="chart-header">
                <Title level={2} className="chart-title">
                    {coinName}{' '}
                    {dataType === 'price' ? 'Price' : dataType === 'market_cap' ? 'Market Cap' : 'Volume'} Chart ({currencySymbol})
                </Title>
                <Col className="price-container">
                    <Title level={5} className="price-change">
                        Change: {millify(dataChange, { precision: 2 })}%
                    </Title>
                    <Title level={5} className="current-price">
                        Current {coinName}{' '}
                        {dataType === 'price' ? 'Price' : dataType === 'market_cap' ? 'Market Cap' : 'Volume'}:{' '}
                        {currencySymbol}
                        {millify(Number(currentValue))}
                    </Title>
                </Col>
            </Row>
            <div className="line-chart-container">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default LineChart;
