const axios = require('axios');

const getExchangeRate = async (from, to) => {
  const { data } = await axios.get(`${process.env.EXCHANGE_RATE_BASE_URL}/${from}`);
  return data.rates[to];
};

const convertAmount = async (amount, from, to) => {
  if (from === to) return amount;
  const rate = await getExchangeRate(from, to);
  return +(amount * rate).toFixed(2);
};

module.exports = { getExchangeRate, convertAmount };
