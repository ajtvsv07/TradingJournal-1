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
import useGetAuthLinkDetails from "../hooks/useGetAuthLinkDetails";
import useGenerateTdTokens from "../hooks/useGenerateTdTokens";
import useSaveTokens from "../hooks/useSaveTokens";

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

  // fetch authlink details
  const {
    data: linkDetails,
    isLoading: linkDetailsLoading,
    isError: linkDetailsError,
  } = useGetAuthLinkDetails();

  // generate TD tokens
  const {
    data: tdTokens,
    isLoading: tdTokensLoading,
    isError: tdTokensError,
  } = useGenerateTdTokens(
    linkDetails,
    linkDetailsLoading,
    linkDetailsError,
    tdAuthCode
  );

  // save tokens to database
  const { data: savedTokens } = useSaveTokens(
    tdTokens,
    tdTokensLoading,
    tdTokensError,
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
    } else if (savedTokens && !savedTokens.success) {
      // handle failure response
      setState({
        ...state,
        statusMessage: "Linking Error :(",
      });
      setTimeout(() => {
        navigate("/app/account", {
          replace: true,
          state: { status: "Error", message: savedTokens.message },
        });
      }, 1500);
    }
  }, [savedTokens]);

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
                <Grid item>
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
