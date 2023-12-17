import { useEffect, useReducer, useState, useRef } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import StockTable from "./Table";
const SERVER_URL = "http://localhost:5000/stocks";
const SOCKET_URL = "ws://localhost:5000";

const inputReducer = (state, action) => {
  if (action.type === "INPUT_CHANGE") {
    return {
      value: action.val,
      isValid:
        action.val <= 20 &&
        action.val !== 0 &&
        action.val.length !== 0 &&
        action.val > 0,
    };
  }

  return state;
};

const StockInput = () => {
  const [stockData, setStockData] = useState([]);

  const [inputValue, dispatch] = useReducer(inputReducer, {
    value: 1,
    isValid: true,
  });

  const connection = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(SOCKET_URL);

    connection.current = socket;

    socket.addEventListener("message", (event) => {
      setStockData(JSON.parse(event.data));
    });
    return () => socket.close();
  }, []);

  const inputChangeHandler = (event) => {
    dispatch({ type: "INPUT_CHANGE", val: event.target.value });
  };

  const submitHandler = () => {
    fetch(`${SERVER_URL}?nos=${inputValue.value}`)
      .then((response) => response.json())
      .then((data) => {
        connection.current.send(JSON.stringify(data.list.map(({ id }) => id)));
        setStockData(data.list);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h4" gutterBottom>
        Stock Pricing App
      </Typography>
      <div style={{ marginBlock: "2rem" }}>
        <TextField
          id="outlined-number"
          label="No. of stocks"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          error={!inputValue.isValid}
          value={inputValue.value}
          onChange={inputChangeHandler}
          helperText="Enter value between 1-20"
        />
        <div>
          <Button
            variant="contained"
            disabled={!inputValue.isValid}
            onClick={submitHandler}
          >
            Get Stocks Data
          </Button>
        </div>
        <div>{stockData.length > 0 && <StockTable stocks={stockData} />}</div>
      </div>
    </Box>
  );
};

export default StockInput;
