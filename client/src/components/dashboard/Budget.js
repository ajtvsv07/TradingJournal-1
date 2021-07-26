import React, { useState, useEffect } from "react";

import { Card } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { getAccessTokens, tknDataValues } from "../../helpers/getAccessTokens";

const Budget = (props) => {
  const [tknVal, setTknVal] = useState("");

  const { data: tokens, isLoading, isError } = getAccessTokens();

  useEffect(() => {
    if (!isLoading && !isError) {
      // console.log(tokens.data);
      setTknVal(tokens.data);
    }
  }, [tokens]);

  // group row data in object
  function createData(token, expires, willRefresh) {
    return { token, expires, willRefresh };
  }

  // TODO: verify these data values are coming in accurately
  // incoming token values
  const {
    refreshToken,
    refreshTokenExpiresIn,
    refreshTokenWillRefreshIn,
    accessToken,
    accessTokenExpiresIn,
    accessTokenWillRefreshIn,
  } = tknDataValues(); // TODO: pass in params

  // aggregate all table data
  const rows = [
    createData(refreshToken, accessToken),
    createData(refreshTokenExpiresIn, accessTokenExpiresIn),
    createData(refreshTokenWillRefreshIn, accessTokenWillRefreshIn),
  ];

  return (
    <Card sx={{ height: "100%" }} {...props}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Refresh Token</TableCell>
              <TableCell>Access Token</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.token}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.token}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.expires}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.willRefresh}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default Budget;
