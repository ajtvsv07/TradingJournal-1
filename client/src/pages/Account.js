import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { Box, Container, Grid } from "@material-ui/core";

import { useAuth0 } from "@auth0/auth0-react";

import AccountProfile from "../components/account/AccountProfile";
import AccountProfileDetails from "../components/account/AccountProfileDetails";
import LinkTdAccount from "../components/account/LinkTdAccount";
import LinkAccStatusModal from "../components/account/LinkAccStatusModal";

export default function Account() {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  const location = useLocation();

  const [linkingAcc, setLinkingAcc] = useState({
    isTdAccountLinked: user["https://tradingjournal/link-account"],
    isIncomingState: Boolean(location.state),
    isModalOpen: false,
    wasModalClosed: null,
    connectStatus: {
      attemptingToLink: false, // display instructions and details
      linkingInProgress: false, // display in progress message - waiting for user to grant authorization
      accountLinkAttempted: false, // display result message - either success or error
      success: null, // display success confirmation message
      succeeded: null, // determine refresh of link state
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
    console.log("isIncomingState ?: ", linkingAcc.isIncomingState);
    // if incoming url state, render message
    if (linkingAcc.isIncomingState) {
      // determine if connect attempt was successful
      const successCondition = Boolean(location.state.status === "Success!");

      setTimeout(() => {
        setLinkingAcc({
          ...linkingAcc,
          isIncomingState: false,
          connectStatus: {
            attemptingToLink: false,
            linkingInProgress: false,
            accountLinkAttempted: true,
            ...(successCondition && { success: true }),
          },
          urlLinkState: {
            message: location.state.message,
            status: location.state.status,
          },
        });
      }, 800);
    }

    if (
      linkingAcc.disconnectStatus.succeeded ||
      linkingAcc.connectStatus.succeeded
    ) {
      // sync with latest linked status
      getAccessTokenSilently({ ignoreCache: true }).then(() => {
        setLinkingAcc({
          ...linkingAcc,
          isTdAccountLinked: user["https://tradingjournal/link-account"],
        });
      });
    }

    return function cleanup() {
      setLinkingAcc({
        ...linkingAcc,
        isTdAccountLinked: user["https://tradingjournal/link-account"],
      });
    };

    // TODO: app is rerendering too much on this useEffect - FIX
  }, []);

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
