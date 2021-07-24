import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { useAuth0 } from "@auth0/auth0-react";

import { Card } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const Budget = (props) => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [tknVal, setTknVal] = useState("");

  async function getTokens() {
    const getClientToken = await getAccessTokenSilently();
    const { data } = await axios.post(
      `${process.env.REACT_APP_EXPRESS_API}/tda/tdAccessTokens`,
      {
        userId: user.sub,
      },
      {
        headers: { Authorization: `Bearer ${getClientToken}` },
      }
    );
    if (!data.success) {
      throw new Error("Unable to generate tokens:", data.error.message);
    }
    return data;
  }

  const {
    data: tokens,
    isLoading,
    isError,
  } = useQuery("generatedTdTokens", () => getTokens());

  useEffect(() => {
    if (!isLoading && !isError) {
      console.log(tokens.data);
      setTknVal(tokens.data);
    }
  }, [tokens]);

  // group row data in object
  function createData(token, expires, willRefresh) {
    return { token, expires, willRefresh };
  }

  // incoming token values
  const refreshToken = `TKN: ${tknVal.refresh_token}`;
  const refreshTokenExpireson = `EXP: ${tknVal.refresh_token_expires_in}`;
  const refreshTokenWillRefreshOn = "RFSH:";
  const accessToken = `TKN: ${tknVal.access_token}`;
  const accessTokenExpireson = `EXP: ${tknVal.expires_in}`;
  const accessTokenWillRefreshOn = "RFSH:";

  // aggregate all table data
  const rows = [
    createData(refreshToken, accessToken),
    createData(refreshTokenExpireson, accessTokenExpireson),
    createData(refreshTokenWillRefreshOn, accessTokenWillRefreshOn),
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
