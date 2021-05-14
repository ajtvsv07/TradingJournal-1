import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

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

// custom styles
const useStyles = makeStyles((theme) => ({
  spinner: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

const HandleAmerAuthCode = () => {
  const classes = useStyles();
  const { user, isAuthenticated } = useAuth0();

  const [state, setState] = useState({
    error: null,
    isLoading: true,
    postAccessTokens: null,
    postAccessTokenStatus: "fetching",
    auth0ClientToken: null,
  });

  // urlDecode auth code from url
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  const authCode = decodeURIComponent(query.get("code")); // store code, pass into the generate tokens method

  // get auth0 client token
  const { clientToken } = useGetAccessTokenSilently();

  // fetch authlink details
  const { linkDetails, status } = useGetAuthLinkDetails(clientToken);

  // generate TD tokens
  const { tdTokens, tdTokenStatus } = useGenerateTdTokens(
    linkDetails,
    status,
    authCode
  );
  console.log({ tdTokens, tdTokenStatus });

  // 4. If token request is successful, save latest data and update account link status
  // const saveOnSuccess = (tdTokens) => {
  //   // eslint-disable-next-line consistent-return
  //   getAccessTokenSilently().then(async (token) => {
  //     if (!token) return new Error("User not signed in");
  //     try {
  //       console.log("Client token: ", token);
  //       const res = await axios.post(
  //         `${process.env.REACT_APP_EXPRESS_API}/tda/updateAccStatusTokens`,
  //         {
  //           data: {
  //             tokens: tdTokens,
  //           },
  //         },
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       console.log("Response from our Express API: ", res.data);
  //       //     // setState({
  //       //     //   ...state,
  //       //     //   PostAccessTokenStatus: "saved",
  //       //     // });
  //     } catch (error) {
  //       //     console.log("Error in saving to Express API", error);
  //       //     // setState({
  //       //     //   ...state,
  //       //     //   error: error.message,
  //       //     // });
  //     }
  //   });
  // };

  // 5. Handle connection error
  // const handleError = ()=>{
  // setError(), hendle etc.
  // }

  // if (tokenStatus) {
  // make request to Express API passing the tokens and user ID
  // useSetupAccountDetails(generatedTokens).then((res)=>{
  //   if(res.success){
  // setState with data
  // }else{
  // setState with error
  //   }
  // })
  // }
  // from there make request to management API to update account linked status
  // if successful, save tokens to database along with unique identifier
  // respond with either success or failure
  // if account status udpate and tokens are successfully saved, setState with success message
  // if failure, setState with error message
  // redirect to dashboard page

  // if token request is unsuccessful setState with error

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
