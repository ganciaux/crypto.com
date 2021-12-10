import React from "react";
import { cryptoFiatGet } from "../services/cryptoFiat";
import millify from "millify";

const CryptoData = ({ label, value, isEuro, isMillify }) => {
  const symbol = isEuro === undefined ? "" : cryptoFiatGet(isEuro, "symbol");
  const formatedValue = isMillify === undefined ? value : millify(value);

  return (
    <p>
      {label}: {formatedValue} {symbol}
    </p>
  );
};

export default CryptoData;
