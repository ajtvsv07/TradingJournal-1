import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Container, Grid } from "@material-ui/core";
import { useLocation } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";

import AccountProfile from "../components/account/AccountProfile";
import AccountProfileDetails from "../components/account/AccountProfileDetails";
import LinkTdAccount from "../components/account/LinkTdAccount";
import AccountLinkedStatusModal from "../components/account/LinkedStatusModal";
import LinkInProgressModal from "../components/account/LinkInProgressModal";

const Account = () => {
  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
  const isIncomingState = Boolean(location.state);
  const [linkingAcc, setLinkingAcc] = useState({
    isTdAccountLinked: user["https://tradingjournal/link-account"],
    accountLinkAttempted: null,
    attemptingToLink: false,
    attemptingToDisconnect: false,
    linkMessage: {
      message: null,
      status: null,
    },
  });

  useEffect(() => {
    if (isIncomingState) {
      setLinkingAcc({
        accountLinkAttempted: true,
        attemptingToLink: false,
        attemptingToDisconnect: false,
        linkMessage: {
          message: location.state.message,
          status: location.state.linkedStatus,
        },
      });
    }
  }, [isIncomingState]);

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
                  setLinkingAcc={setLinkingAcc}
                />
              </Grid>
            </Grid>
            {
              // linkInProgress modal - displays while there's a link attempt in progress
              linkingAcc.attemptingToLink ? (
                <LinkInProgressModal
                  linkingAcc={linkingAcc}
                  setLinkingAcc={setLinkingAcc}
                />
              ) : (
                ""
              )
            }
            {
              // accountLinkAttempted modal - displays attempt error or success
              linkingAcc.accountLinkAttempted ? (
                <AccountLinkedStatusModal
                  message={linkingAcc.linkMessage.message}
                  linkedStatus={linkingAcc.linkMessage.status}
                />
              ) : (
                ""
              )
            }
          </Container>
        </Box>
      </>
    )
  );
};

export default Account;
