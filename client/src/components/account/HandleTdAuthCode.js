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
import useGetAccessTokenSilently from "../../utils/useGetAccessTokenSilently";
import useGetAuthLinkDetails from "../../utils/useGetAuthLinkDetails";
import useGenerateTdTokens from "../../utils/useGenerateTdTokens";
import useSaveTokens from "../../utils/useSaveTokens";

// custom styles
const useStyles = makeStyles(() => ({
  spinner: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

const HandleAmerAuthCode = () => {
  const classes = useStyles();
  const { isAuthenticated } = useAuth0();

  const [state, setState] = useState({
    error: null,
    isLoading: true,
    statusMessage: "Linking your account...",
  });

  // urlDecode auth code from url
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  // needed to useGenerateTdTokens and useSaveTokens
  const tdAuthCode = decodeURIComponent(query.get("code"));

  // get auth0 client token
  const { clientToken } = useGetAccessTokenSilently();

  // fetch authlink details
  const { linkDetails, authLinkStatus } = useGetAuthLinkDetails(clientToken);

  // generate TD tokens
  const { tdTokens, tdTokenStatus } = useGenerateTdTokens(
    linkDetails,
    authLinkStatus,
    tdAuthCode
  );

  // save tokens to database
  const { savedTokens, savedTokenStatus } = useSaveTokens(
    tdTokens,
    tdTokenStatus,
    clientToken,
    tdAuthCode
  );

  const navigate = useNavigate();

  useEffect(() => {
    // handle successful response
    if (savedTokenStatus === "fetched" && savedTokens.success) {
      console.log({ savedTokens, savedTokenStatus });
      setState({
        ...state,
        statusMessage: "Account Linked!",
      });
      setTimeout(() => {
        navigate("/app/account", {
          replace: true,
          state: { linkedStatus: "Success!", message: savedTokens.message },
        });
      }, 1500);
    } else {
      // handle failure response
      setState({
        ...state,
        statusMessage: "Linking Error",
      });
      setTimeout(() => {
        navigate("/app/account", {
          replace: true,
          state: { linkedStatus: "Error", message: savedTokens.message },
        });
      }, 1500);
    }
  }, [savedTokens, savedTokenStatus]);

  // if failure, setState with error message

  // redirect back to user account page, passing state messages to display to the user

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
            <div className={classes.spinner}>
              <Typography variant="h6">{state.statusMessage}</Typography>
              {state.isLoading ? <CircularProgress /> : ""}
            </div>
            <Grid container>
              <Grid item>
                <Typography>
                  This is the empty page that will handle the TD Ameritrade auth
                  code linking
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </>
    )
  );
};

export default HandleAmerAuthCode;
