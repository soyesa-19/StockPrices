const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./Models/Http-Error");
const uuid = require("uuid");
const getStocksData = require("./utils/stockServices");
const app = express();
let STOCK_LIST;

require("express-ws")(app);

app.use(bodyParser.json());

app.use(express.static("dist"));

app.get("/", (req, res, next) => {
  res.sendFile("index.html");
});

app.get("/stocks", (req, res, next) => {
  const nos = req.query.nos;
  res.setHeader("access-control-allow-origin", "*");
  res.json({ list: STOCK_LIST.slice(0, nos) });
});

let socketConnection = {};

app.ws("/", function (ws, req) {
  ws.id = uuid.v4();
  ws.on("message", (msg) => {
    const input = JSON.parse(msg);
    if (socketConnection[ws.id]) {
      clearInterval(socketConnection[ws.id]);
    }
    socketConnection[ws.id] = setInterval(() => {
      const updatedlist = input.map((id) => {
        const stock = STOCK_LIST.find((s) => s.id === id);
        if (!stock) {
          throw new HttpError("Stock cannot be found, PLease check", 400);
        }
        const timestamp = Date.now();
        if (stock.lastUpdated + stock.refreshInterval * 1000 <= timestamp) {
          stock.price = (Math.random() * 1000 + 100).toFixed(2);
          stock.lastUpdated = timestamp;
        }
        return stock;
      });
      ws.send(JSON.stringify(updatedlist));
    }, 2000);
  });

  ws.on("close", () => {
    clearInterval(socketConnection[ws.id]);
  });
});

app.use((req, res, next) => {
  throw new HttpError("This route cannot be found", 404);
});

app.use((error, req, res, next) => {
  res
    .status(error.code || 500)
    .json({ message: error.message || "An internal server error occured" });
});

getStocksData().then((data) => {
  STOCK_LIST = data;
  app.listen(process.env.PORT || 5000, () => {
    console.log("Server started on port 5000");
  });
});
