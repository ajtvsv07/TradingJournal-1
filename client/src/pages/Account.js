import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { Box, Container, Grid } from "@material-ui/core";

import { useAuth0 } from "@auth0/auth0-react";

import AccountProfile from "../components/account/AccountProfile";
import AccountProfileDetails from "../components/account/AccountProfileDetails";
import LinkTdAccount from "../components/account/LinkTdAccount";
import LinkAccStatusModal from "../components/account/LinkAccStatusModal";

export default function Account() {
  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
  const isIncomingState = Boolean(location.state);

  const [linkingAcc, setLinkingAcc] = useState({
    isTdAccountLinked: user["https://tradingjournal/link-account"],
    isModalOpen: false,
    wasModalClosed: null,
    connectStatus: {
      attemptingToLink: false, // display instructions and details
      linkingInProgress: false, // display in progress message - waiting for user to grant authorization
      accountLinkAttempted: null, // used to display modal
      success: null, // display success confirmation message
    },
    disconnectStatus: {
      attemptingToDisconnect: false, // display instructions and details
      error: null, // display error modal
      message: null, // display server message
      success: null, // display success confirmation message
      succeeded: null, // determine refresh of link state
    },
    urlLinkState: {
      message: null,
      status: null,
    },
  });

  useEffect(() => {
    // connected account successfully
    if (isIncomingState && location.state.status === "Success!") {
      setLinkingAcc({
        ...linkingAcc,
        isModalOpen: true,
        connectStatus: {
          attemptingToLink: false,
          linkingInProgress: false,
          accountLinkAttempted: true,
          success: true,
        },
        urlLinkState: {
          message: location.state.message,
          status: location.state.status,
        },
      });
      // connection failed
    } else if (isIncomingState) {
      // handle fail
    }

    return null;

    // return function cleanup() {
    //   setLinkingAcc({
    //     ...linkingAcc,
    //     isTdAccountLinked: user["https://tradingjournal/link-account"],
    //   });
    // };

    // TODO: app is rerendering too much on this useEffect - FIX
  }, [isIncomingState]);

  // callback for updating this parent state from child components
  function updateState(statusFromChild) {
    setLinkingAcc(statusFromChild);
  }

  return (
    isAuthenticated && (
      <>
        <Helmet>
          <title>Account | Trading Journal</title>
        </Helmet>
        <Box
          sx={{
            backgroundColor: "background.default",
            minHeight: "100%",
            py: 3,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} xs={12}>
                <AccountProfile />
              </Grid>
              <Grid item lg={8} md={6} xs={12}>
                <AccountProfileDetails />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} xs={12}>
                <Box />
              </Grid>
              <Grid item lg={8} md={6} xs={12}>
                <LinkTdAccount
                  linkingAcc={linkingAcc}
                  updateState={updateState}
                />
              </Grid>
            </Grid>
            <LinkAccStatusModal
              linkingAcc={linkingAcc}
              updateState={updateState}
            />
          </Container>
        </Box>
      </>
    )
  );
}
