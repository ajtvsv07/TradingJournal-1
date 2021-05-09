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

import { useAuth0 } from "@auth0/auth0-react";

import axios from "axios";

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

const ConnectTDAccount = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const classes = useStyles();

  const [accountLinked, setAccountLinked] = useState({
    linkAccount: user["https://tradingjournal/link-account"],
  });

  // TODO: toggle switch to display additional content
  // TODO: map out process where the setting is saved to the server only at the end with final confirmation

  console.log("Link account status at beginning: ", accountLinked.linkAccount);

  const handleLinkAccountChange = async () => {
    // TODO: will need to later upate this on the auth0 side, during final confirmation that the account has been linked
    setAccountLinked(() => ({
      ...accountLinked,
      linkAccount: !accountLinked.linkAccount,
    }));

    // ignore the server request for now
 
  };

  // generate auth link
  const generateAuthLink = async () => {
    const baseURl = process.env.REACT_APP_TD_AUTH_BASE_URL;
    const endUrl = process.env.REACT_APP_TD_AUTH_END_URL;

    // TODO: Notify user they are being redirected to the trusted provider - Possible countdown
    const token = await getAccessTokenSilently();
    const res = await axios.get(
      `${process.env.REACT_APP_EXPRESS_API}/tda/tdaUserAuthLink`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { redirectUri, clientId } = res.data.payload;

    // TODO: open link in the same window
    window.open(`${baseURl + redirectUri}&client_id=${clientId + endUrl}`);
  };

  return (
    isAuthenticated && (
      <Box mb={10}>
        <Card>
          <CardHeader
            subheader="Manage your connection to TD Ameritrade in order to automatically sync your trades"
            title="Connect to TD Ameritrade"
          />
          <Divider />
          <CardContent>
            <Grid container spacing={6} wrap="wrap">
              <Grid item>
                <Typography color="text-primary" variant="h4">
                  User Account Details
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={accountLinked.linkAccount}
                      onChange={handleLinkAccountChange}
                      name="linkAccount"
                      color="primary"
                    />
                  }
                  label={
                    accountLinked.linkAccount ? (
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
                          ON
                        </Typography>
                        <Typography color="textPrimary" variant="h5">
                          I want to reap the benefits of automatic syncing.
                        </Typography>
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
                          OFF
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
            {accountLinked.linkAccount ? (
              <div>
                <Grid item xs={12}>
                  <Typography color="text-primary">
                    In order to connect your TD Ameritrade Account, you&apos;ll
                    neeed to log in with your TD Ameritrade username and
                    password. Please have those on hand and click connect when
                    you&apos;re ready.
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
    )
  );
};

export default ConnectTDAccount;
