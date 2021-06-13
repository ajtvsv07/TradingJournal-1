import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Container, Grid } from "@material-ui/core";
import { useLocation } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";

import AccountProfile from "../components/account/AccountProfile";
import AccountProfileDetails from "../components/account/AccountProfileDetails";
import LinkTdAccount from "../components/account/LinkTdAccount";
import LinkAccStatusModal from "../components/account/LinkAccStatusModal";

const Account = () => {
  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
  const isIncomingState = Boolean(location.state);
  const [linkingAcc, setLinkingAcc] = useState({
    isTdAccountLinked: user["https://tradingjournal/link-account"],
    accountLinkAttempted: false,
    attemptingToLink: false,
    attemptingToDisconnect: false,
    disconnectFailed: null,
    linkState: {
      message: null,
      status: null,
    },
  });

  console.log("Acc Parent Component: ", linkingAcc);

  useEffect(() => {
    if (isIncomingState) {
      setLinkingAcc({
        ...linkingAcc,
        accountLinkAttempted: true,
        attemptingToLink: false,
        linkState: {
          message: location.state.message,
          status: location.state.linkedStatus,
        },
      });
    }
  });

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
            <LinkAccStatusModal
              linkingAcc={linkingAcc}
              setLinkingAcc={setLinkingAcc}
            />
          </Container>
        </Box>
      </>
    )
  );
};

export default Account;
