import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import { useAuth0 } from "@auth0/auth0-react";
import useGetAccessTokenSilently from "./useGetAccessTokenSilently";
import useGetAuthLinkDetails from "./useGetAuthLinkDetails";
import useGenerateTdTokens from "./useGenerateTdTokens";
import useSaveTokens from "./useSaveTokens";

// custom styles
const useStyles = makeStyles(() => ({
  center: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  spacer: {
    margin: "2rem 0 2rem",
  },
}));

// handle incoming response from TD Ameritrade with success or failure
export default function HandleAmerAuthCode() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const [state, setState] = useState({
    error: null,
    isLoading: true,
    statusMessage: "In Progress...",
  });

  // urlDecode auth code
  const urlAuthCode = () => new URLSearchParams(useLocation().search);
  const urlQuery = urlAuthCode();
  const tdAuthCode = decodeURIComponent(urlQuery.get("code"));

  // get auth0 client token
  const { data: clientToken, isError: clientTokenError } =
    useGetAccessTokenSilently();

  // fetch authlink details
  const { data: linkDetails, isError: linkDetailsError } =
    useGetAuthLinkDetails(clientToken, clientTokenError);

  // generate TD tokens
  const { data: tdTokens, isError: tdTokensError } = useGenerateTdTokens(
    linkDetails,
    linkDetailsError,
    tdAuthCode
  );

  // save tokens to database
  const { data: savedTokens, isError: savedTokenError } = useSaveTokens(
    tdTokens,
    tdTokensError,
    clientToken,
    tdAuthCode
  );

  useEffect(() => {
    // handle successful response
    if (savedTokens && savedTokens.success) {
      // console.log({ savedTokens });
      setState({
        ...state,
        statusMessage: "Account Linked!",
      });
      setTimeout(() => {
        navigate("/app/account", {
          replace: true,
          state: { status: "Success!", message: savedTokens.message },
        });
      }, 1500);
    } else if (savedTokens && savedTokenError) {
      // handle failure response
      setState({
        ...state,
        statusMessage: "Linking Error",
      });
      setTimeout(() => {
        navigate("/app/account", {
          replace: true,
          state: { status: "Error", message: savedTokens.message },
        });
      }, 1500);
    }
  }, [savedTokens]);

  // TODO: Keep track of the time limit on the refresh token (90 days), and access token (30 min)
  // TODO: exchange token for new version before it expires

  return (
    isAuthenticated && (
      <>
        <Helmet>
          <title>Connect TD | Trading Journal</title>
        </Helmet>
        <Box
          sx={{
            backgroundColor: "background.default",
            minHeight: "100%",
            py: 3,
          }}
        >
          <Container maxWidth="lg">
            <div className={classes.center}>
              {state.isLoading ? <CircularProgress /> : ""}
              <Typography variant="h4">Linking Your Account</Typography>
              <Grid container>
                <Grid item className={classes.spacer}>
                  <Typography>Stay Put, almost done!</Typography>
                </Grid>
              </Grid>
              <Typography variant="h6">{state.statusMessage}</Typography>
            </div>
          </Container>
        </Box>
      </>
    )
  );
}
