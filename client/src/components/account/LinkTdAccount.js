import React, { useState } from "react";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import PropTypes from "prop-types";
import useGetAccessTokenSilently from "../../utils/useGetAccessTokenSilently";
import useGetAuthLinkDetails from "../../utils/useGetAuthLinkDetails";

import disconnectAccount from "./DisconnectTdAccount";

const useStyles = makeStyles((theme) => ({
  // TODO: Fix loading spinner size in button. Currently button changes size
  container: {
    justifyContent: "flex-end",
  },
  grayButton: {
    backgroundColor: "#333",
    minWidth: "170px",
  },
  saveButton: {
    minWidth: "170px",
  },
}));

// listen for incoming route state - which communicates link status

// useState to determine if
// tdAccountLinked [true/false] - derived from parent component ?
// linkInProgress [true/false]
// connecting [true/false]
// disconnecting [true/false]

// if accountStatus is not linked - display toggle off and a connect button (User can connect by clicking toggle or connect button)
// if user clicks connect or toggles on -
// update state with connecting [true]
// display connect/cancel buttons along with description(warn about pop-up blockers) and updated toggle label
// if user clicks Link Account button -
// update parent state with linkInProgress [true]
// open up new tab for user to authenticate to their td Account and provide permissions
// if user clicks cancel button or toggles off -
// update state with connecting [false]
// hide description and cancel/connect buttons

// if accountStatus is linked - display toggle on and a disconnect button (User can disconnect by clicking toggle or disconnect button)
// if user clicks disconnect or toggles off -
// update state with connecting [false]
// display modal dialog with more info and a "Yes I'm sure - disconnect my account" button
// if user proceeds to disconnect -
// update state with disconnecting [true]
// trigger loading animation
// begin requests to disconnect - display success/error message from server

const ConnectTDAccount = ({ linkingAcc, setLinkingAcc }) => {
  const classes = useStyles();

  // get auth0 client token
  const { clientToken } = useGetAccessTokenSilently();
  // fetch authlink details
  const { linkDetails, authLinkStatus } = useGetAuthLinkDetails(clientToken);

  const disconnectTdAccount = () => {
    // update parent component state
    setLinkingAcc(() => ({
      ...linkingAcc,
      attemptingToDisconnect: true,
    }));
    // call disconnect function
    disconnectAccount(clientToken);
  };

  const handleLinkAccountChange = () => {
    setLinkingAcc(() => ({
      ...linkingAcc,
      attemptingToLink: true,
    }));
  };

  // generate td auth link
  const generateAuthLink = async () => {
    const baseURl = process.env.REACT_APP_TD_AUTH_BASE_URL;
    const endUrl = process.env.REACT_APP_TD_AUTH_END_URL;
    // TODO: Notify user they are being redirected to the trusted provider - Possible countdown
    const { clientId, redirectUri } = await linkDetails.data.payload;
    await setLinkingAcc({
      ...linkingAcc,
      attemptingToLink: true,
    });
    window.open(`${baseURl + redirectUri}&client_id=${clientId + endUrl}`);
  };

  return (
    <Box mb={10}>
      <Card>
        <CardHeader
          title="Connect to TD Ameritrade"
          subheader="Manage your connection to TD Ameritrade in order to automatically sync your trades"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={6} wrap="wrap">
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    checked={linkingAcc.isTdAccountLinked}
                    onChange={handleLinkAccountChange}
                    name="linkAccount"
                    color="primary"
                  />
                }
                label={
                  linkingAcc.isTdAccountLinked ? (
                    <Grid
                      container
                      spacing={5}
                      direction="row"
                      justify="flex-start"
                      alignItems="center"
                      pt={5}
                      ml={1}
                    >
                      <Typography variant="h4" mr={2}>
                        Account Linked
                      </Typography>
                      <Typography color="textPrimary" variant="h5">
                        Syncing trades automatically
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          p: 2,
                        }}
                      >
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={disconnectTdAccount}
                        >
                          Disconnect my TD Ameritrade Account
                        </Button>
                      </Box>
                    </Grid>
                  ) : (
                    <Grid
                      container
                      spacing={5}
                      direction="row"
                      justify="flex-start"
                      alignItems="center"
                      pt={5}
                      ml={1}
                    >
                      <Typography variant="h4" mr={2}>
                        Account Not Linked
                      </Typography>
                      <Typography color="textPrimary" variant="h5">
                        I don&apos;t want to sync my trades.
                      </Typography>
                    </Grid>
                  )
                }
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardContent>
          {linkingAcc.attemptingToLink ? (
            <div>
              <Grid item xs={12}>
                <Typography color="text-primary">
                  In order to connect your TD Ameritrade Account, you&apos;ll
                  neeed to log in with your TD Ameritrade username and password.
                  Please have those on hand and click connect when you&apos;re
                  ready.
                </Typography>
              </Grid>
              <Grid
                container
                pt={5}
                justify="flex-end"
                alignItems="center"
                spacing={3}
                className={classes.container}
              >
                <Grid item xs={12} sm={6} lg={3}>
                  <Button
                    size="medium"
                    variant="contained"
                    className={classes.grayButton}
                    onClick={handleLinkAccountChange}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <Button
                    size="medium"
                    variant="contained"
                    className={classes.saveButton}
                    onClick={generateAuthLink}
                  >
                    Connect
                  </Button>
                </Grid>
              </Grid>
            </div>
          ) : (
            ""
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

ConnectTDAccount.propTypes = {
  setLinkingAcc: PropTypes.func,
  linkingAcc: PropTypes.object,
};

export default ConnectTDAccount;
