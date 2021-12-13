import React from 'react'
import { Line } from 'react-chartjs-2'
import { Col, Row, Typography } from 'antd'
import { cryptoFiatGet } from "../services/cryptoFiat";

const { Title } = Typography

const LineChart = ({ coinHistory, currentPrice, coinName, isEuro }) => {
  const coinPrice = []
  const coinTimestamp = []
  const symbol = isEuro === undefined ? "???" : cryptoFiatGet(isEuro, "symbol");
  const label = isEuro === undefined ? "???" : cryptoFiatGet(isEuro, "label");

  console.log('LineChart: render')

  for (let i = 0; i < coinHistory?.prices?.length; i += 1) {
    coinPrice.push(coinHistory?.prices[i][1])
    coinTimestamp.push(new Date(coinHistory?.prices[i][0]).toLocaleDateString())
  }

  const data = {
    labels: coinTimestamp,
    datasets: [
      {
        label: `Price In ${label}`,
        data: coinPrice,
        fill: false,
        backgroundColor: '#0071bd',
        borderColor: '#0071bd',
      },
    ],
  }

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }

  return (
    <>
      <Row className="chart-header">
        <Title level={2} className="chart-title">
          {coinName} Price Chart{' '}
        </Title>
        <Col className="price-container">
          <Title level={5} className="price-change">
            Change: {coinHistory?.data?.change}%
          </Title>
          <Title level={5} className="current-price">
            Current {coinName} Price: {symbol} {currentPrice}
          </Title>
        </Col>
      </Row>
      <Line data={data} options={options} />
    </>
  )
}

export default LineChart
