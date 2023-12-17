import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StockTable = ({ stocks }) => {
  const rows = stocks?.sort((a, b) => b.lastUpdated - a.lastUpdated);
  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: "550px", margin: "auto", marginBlock: "2rem" }}
    >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Stock Name</TableCell>
            <TableCell>Last Updated</TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>
                {new Date(row.lastUpdated).toLocaleTimeString()}
              </TableCell>
              <TableCell align="right">{row.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StockTable;
