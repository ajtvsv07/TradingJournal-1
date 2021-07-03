/* eslint-disable no-else-return */
import React, { useEffect, useState, useCallback } from "react";

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

import PropTypes from "prop-types";
import { useAuth0 } from "@auth0/auth0-react";

export default function LinkTdAccount({ linkingAcc, updateState }) {
  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (linkingAcc.wasModalClosed) {
      // sync with latest linked status whenever a modal has been closed
      getAccessTokenSilently({ ignoreCache: true }).then(() => {
        updateState({
          ...linkingAcc,
          isTdAccountLinked: user["https://tradingjournal/link-account"],
          wasModalClosed: null,
        });
      });
    }
  }, [linkingAcc.wasModalClosed]);

  function handleToggle() {
    if (linkingAcc.isTdAccountLinked) {
      updateState({
        ...linkingAcc,
        isTdAccountLinked: ((prevState) => !prevState)(),
        isModalOpen: ((prevState) => !prevState)(),
        disconnectStatus: {
          ...linkingAcc.disconnectStatus,
          attemptingToDisconnect: true,
        },
      });
    } else {
      updateState({
        ...linkingAcc,
        isTdAccountLinked: ((prevState) => !prevState)(),
        isModalOpen: ((prevState) => !prevState)(),
        connectStatus: {
          ...linkingAcc.connectStatus,
          attemptingToLink: true,
        },
      });
    }
  }

  return (
    <Box mb={10}>
      <Card>
        <CardHeader
          title="Connection to TD Ameritrade"
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
                    onChange={handleToggle}
                    name="linkAccount"
                    color="primary"
                  />
                }
                label={(() => {
                  // is connected
                  if (linkingAcc.isTdAccountLinked) {
                    return (
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
                      </Grid>
                    );
                  }
                  // is not connected
                  else if (!linkingAcc.isTdAccountLinked) {
                    return (
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
                    );
                  }
                  // in the process of disconnecting
                  else {
                    return (
                      <div>
                        <Typography variant="h3">
                          Attempting to Disconnect
                        </Typography>
                      </div>
                    );
                  }
                })()}
              />
            </Grid>
            {(() => {
              // render action button depending on connection status
              if (linkingAcc.isTdAccountLinked) {
                return (
                  <Grid item>
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
                        onClick={handleToggle}
                      >
                        Disconnect my TD Ameritrade Account
                      </Button>
                    </Box>
                  </Grid>
                );
              } else {
                // is not connected
                return (
                  <Grid item>
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
                        onClick={handleToggle}
                      >
                        Link my TD Ameritrade Account
                      </Button>
                    </Box>
                  </Grid>
                );
              }
            })()}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

LinkTdAccount.propTypes = {
  updateState: PropTypes.func,
  linkingAcc: PropTypes.object,
};
