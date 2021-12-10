import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Divider,
  Modal,
  Button,
  Switch,
} from "antd";
import Loader from "./Loader";

import crypto_com_cryptos from "../data/crypto_com_cryptos.json";
import crypto_waiting_price from "../data/crypto_waiting_price.json";
import { useGetCryptosMarketsQuery } from "../services/cryptoApiGecko";
import { cryptoFiatGet } from "../services/cryptoFiat";
import { cryptoApiFormat } from "../services/cryptoApiFormat";
import CryptoData from "./CryptoData";

const CryptoList = () => {
  const { Option } = Select;
  const [isEuro, setIsEuro] = useState(true);
  const [profitLoss, setProfitLoss] = useState(0.0);
  const [currency, setCurrency] = useState("");
  const [cryptosDataApiFormated, setCryptosDataApiFormated] = useState([]);
  const {
    data: cryptosDataApi,
    isFetching,
    isSuccess,
    refetch,
  } = useGetCryptosMarketsQuery({ vs_currency: currency });

  const handleVsCurrency = (checked, event) => {
    setIsEuro(checked);
  };

  useEffect(() => {
    setCurrency(cryptoFiatGet(isEuro, "vs_currency"));
    refetch();
  }, [isEuro]);

  useEffect(() => {
    let total=0.0
    const dataApiFormated = cryptosDataApi?.map((crypto) => {
      const dataFormated = cryptoApiFormat(crypto, "gecko");
      const coinData = crypto_com_cryptos.coins?.find((coin) => {
        return coin.symbol.toLowerCase() === dataFormated.symbol.toLowerCase();
      });
      const coinWaitingPrice = crypto_waiting_price.coins?.find((coin) => {
        return coin.symbol.toLowerCase() === dataFormated.symbol.toLowerCase();
      });
      if (coinData !== undefined) {
        dataFormated.coins = coinData.total.coins;
        dataFormated.total =
          coinData.total[currency].purchases + coinData.total[currency].sales;
          dataFormated.total_current=dataFormated.current_price * dataFormated.coins
        dataFormated.profit =
        dataFormated.total_current - dataFormated.total;
        dataFormated.purchase_price = dataFormated.total / dataFormated.coins;
        dataFormated.operations = coinData.operations;
      }
      if (coinWaitingPrice !== undefined) {
        dataFormated.waiting_price_sell = coinWaitingPrice[currency].sell;
        dataFormated.waiting_price_buy = coinWaitingPrice[currency].buy;
      }
      if (dataFormated.profit>0){
        dataFormated.class="crypto-profit"
      }
      else{
        dataFormated.class="crypto-loss"
      }
      total+=dataFormated.profit
      return dataFormated;
    });
    setCryptosDataApiFormated(dataApiFormated);
    setProfitLoss(total);
  }, [cryptosDataApi]);

  if (isFetching) return <Loader />;

  return (
    <>
      <Card title="Crypto.com">
        <CryptoData
          label="Purchase"
          value={crypto_com_cryptos.total_purchase[currency]}
          isEuro={isEuro}
        />
        <CryptoData label="Profit/Loss" value={profitLoss} isEuro={isEuro} />
        <p>
          {cryptoFiatGet(isEuro, "label")}:{" "}
          <Switch defaultChecked checked={isEuro} onChange={handleVsCurrency} />
        </p>
      </Card>

      <Divider />

      <Row gutter={[32, 32]} className="crypto-card-container">
        {cryptosDataApiFormated?.map((crypto) => (
          <Col xs={24} sm={12} lg={6} className="crypto-card" key={crypto.id}>
            <Card
              className={crypto.class}
              title={`${crypto.symbol.toUpperCase()} - ${crypto.name}`}
              extra={
                <img alt="crypto" className="crypto-image" src={crypto.image} />
              }
              hoverable
            >
              <CryptoData label="Coins" value={crypto.coins} />
              <CryptoData
                label="Purchase"
                value={crypto.purchase_price}
                isEuro={isEuro}
              />
              <CryptoData label="Total (purchase)" value={crypto.total} isEuro={isEuro} />
              <CryptoData label="Total (current)" value={crypto.total_current} isEuro={isEuro} />
              <CryptoData
                label="Profit/loss"
                value={crypto.profit}
                isEuro={isEuro}
              />
              <Divider />
              <CryptoData
                label="Price (now)"
                value={crypto.current_price}
                isEuro={isEuro}
              />
              <CryptoData
                label="Price (wait sell)"
                value={crypto.waiting_price_sell}
                isEuro={isEuro}
              />
              <CryptoData
                label="Price (wait buy)"
                value={crypto.waiting_price_buy}
                isEuro={isEuro}
              />
              <CryptoData
                label="All Time High"
                value={crypto.ath}
                isEuro={isEuro}
              />
              <CryptoData
                label="Market cap"
                value={crypto.market_cap}
                isMillify
              />
              <CryptoData
                label="Total volume"
                value={crypto.total_volume}
                isMillify
              />
              <CryptoData
                label="Circulating supply"
                value={crypto.circulating_supply}
                isMillify
              />
              <CryptoData
                label="Total supply"
                value={crypto.total_supply}
                isMillify
              />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default CryptoList;
