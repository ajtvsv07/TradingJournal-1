import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { Card } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import useGetAuthLinkDetails from "../../hooks/useGetAuthLinkDetails";
import testTokens from "../../helpers/testTokens";

const Budget = (props) => {
  const { user, getAccessTokenSilently } = useAuth0();

  const [tokenValues, setTokenValues] = useState({
    rfTkn: null,
    rfTknExpIn: null,
    rfTknWillRefreshIn: null,
    accssTkn: null,
    accssTknExpIn: null,
    accssTknWillRefreshIn: null,
  });

  // fetch authlink details
  const {
    data: linkDetails,
    isLoading: linkDetailsLoading,
    isError: linkDetailsError,
  } = useGetAuthLinkDetails();

  // set data values
  useEffect(() => {
    if (!linkDetailsLoading && !linkDetailsError) {
      const tkns = testTokens(user, getAccessTokenSilently, linkDetails);
      tkns.then((result) => {
        setTokenValues(result);
      });
    }
  }, [user, getAccessTokenSilently, linkDetails]);

  // table data
  const rows = [
    {
      token: tokenValues.accssTkn,
      expiresIn: tokenValues.accssTknExpIn,
      willRefreshIn: tokenValues.accssTknWillRefreshIn,
    },
    {
      token: tokenValues.rfTkn,
      expiresIn: tokenValues.rfTknExpIn,
      willRefreshIn: tokenValues.rfTknWillRefreshIn,
    },
  ];

  return (
    <Card sx={{ height: "100%" }} {...props}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Tokens</TableCell>
              <TableCell>Valid For</TableCell>
              <TableCell>Will Refresh In</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokenValues.rfTkn ? (
              rows.map((row) => (
                <TableRow
                  key={row.token}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.token}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.expiresIn}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.willRefreshIn}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>null</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default Budget;
