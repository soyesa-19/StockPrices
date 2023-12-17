const POLYGON_API =
  "https://api.polygon.io/v3/reference/tickers?active=true&limit=20&apiKey=00LfdxWynPp5MVkwgj2Av57ehhcAPCxq";

const getTickers = () => {
  return fetch(POLYGON_API)
    .then((response) => response.json())
    .then((data) => {
      return data.results.map(({ ticker, name }) => ({ id: ticker, name }));
    });
};

const getStockData = async () => {
  const tickers = await getTickers(); //[{name:, ticker:,}]
  tickers.forEach(async (ticker) => {
    ticker.price = (Math.random() * 1000 + 100).toFixed(2);
    ticker.lastUpdated = Date.now();
    ticker.refreshInterval = Math.ceil(Math.random() * 5 + 8);
  });
  return tickers;
};

module.exports = getStockData;
