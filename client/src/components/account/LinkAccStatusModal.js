/* eslint-disable no-else-return */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import CircularProgress from "@material-ui/core/CircularProgress";

import { useAuth0 } from "@auth0/auth0-react";

import useGetAccessTokenSilently from "../../utils/useGetAccessTokenSilently";
import useGetAuthLinkDetails from "../../utils/useGetAuthLinkDetails";

import disconnectTdAccount from "./DisconnectTdAccount";

const useStyles = makeStyles({
  button: {
    margin: "1.5rem 0 0",
    minWidth: "100%",
    marginBottom: "1rem",
  },
  grayButton: {
    backgroundColor: "#333",
  },
  spinner: {
    color: "#ffffff",
    margin: "0.7rem",
  },
  dialogTitle: {
    padding: "1rem 0",
    color: "#333333",
    fontWeight: "700",
  },
  dialogDescrition: {
    padding: "1rem 0",
    color: "#333333",
    fontWeight: "700",
  },
});

const style = {
  box: {
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  },
};

// modal template to render messages
function ModalDialog({ title, status, description, buttonContent, open, id }) {
  const classes = useStyles();
  return (
    <Dialog aria-labelledby="simple-dialog-title" open={open} id={id}>
      <Box sx={style.box}>
        <Typography
          component="div"
          variant="h2"
          align="left"
          classes={{ root: classes.dialogTitle }}
        >
          {title}
        </Typography>
        <Grid container>
          <div>
            <br />
          </div>
        </Grid>
        <Typography
          component="div"
          variant="h5"
          classes={{ root: classes.dialogStatus }}
        >
          {status}
        </Typography>
        <br />
        {description}
        <br />
        {buttonContent}
      </Box>
    </Dialog>
  );
}

export default function LinkAccStatusModal({ linkingAcc, setLinkingAcc }) {
  const classes = useStyles();
  const { user } = useAuth0();
  const { clientToken } = useGetAccessTokenSilently();
  const { linkDetails, authLinkStatus } = useGetAuthLinkDetails(clientToken);
  const [isLoading, setIsLoading] = useState(false);
  const [latestAccLinkStatus, setLatestAccLinkStatus] = useState(linkingAcc);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // open modal on every re-render
    setIsOpen(true);

    // clear is loading status in case connection times out
    setIsLoading(false);

    // ensure component status is always up to do date with parent state
    if (latestAccLinkStatus !== linkingAcc) {
      setLatestAccLinkStatus(linkingAcc);
    }
  }, [linkingAcc]);

  // generate td auth link for user authorization
  async function generateAuthLink() {
    const baseURl = process.env.REACT_APP_TD_AUTH_BASE_URL;
    const endUrl = process.env.REACT_APP_TD_AUTH_END_URL;
    const { clientId, redirectUri } = await linkDetails.data.payload;

    window.open(`${baseURl + redirectUri}&client_id=${clientId + endUrl}`);
  }

  async function linkTdAccount() {
    // generate authorization link to redirect user
    if (authLinkStatus === "fetched") {
      await generateAuthLink();
    }
    setLinkingAcc({
      ...linkingAcc,
      connectStatus: {
        ...linkingAcc.connectStatus,
        attemptingToLink: false,
        linkingInProgress: true,
      },
    });
  }

  function disconnectAccount() {
    setIsLoading(true);
    disconnectTdAccount(user, clientToken).then((response) => {
      setTimeout(() => {
        // display error in new modal
        if (!response.success) {
          setLinkingAcc({
            ...linkingAcc,
            disconnectStatus: {
              attemptingToDisconnect: false,
              error: true,
              message: response.message,
            },
          });
        } else {
          // display success in new modal
          setLinkingAcc({
            ...linkingAcc,
            disconnectStatus: {
              ...linkingAcc.disconnectStatus,
              attemptingToDisconnect: false,
              success: true,
              message: response.message,
            },
          });
        }
      }, 800);
    });
  }

  function closeModal() {
    if (latestAccLinkStatus.disconnectStatus.attemptingToDisconnect) {
      // cancel proceeding to disconnect
      setLinkingAcc({
        ...linkingAcc,
        disconnectStatus: {
          ...linkingAcc.disconnectStatus,
          attemptingToDisconnect: false,
        },
      });
    } else if (latestAccLinkStatus.connectStatus.attemptingToLink) {
      // cancel proceeding to link account
      setLinkingAcc({
        ...linkingAcc,
        connectStatus: {
          ...linkingAcc.connectStatus,
          attemptingToLink: false,
        },
      });
    } else if (latestAccLinkStatus.connectStatus.linkingInProgress) {
      // cancel linking in background
      setLinkingAcc({
        ...linkingAcc,
        connectStatus: {
          ...linkingAcc.connectStatus,
          linkingInProgress: false,
        },
      });
    } else if (latestAccLinkStatus.connectStatus.accountLinkAttempted) {
      // close modal confirmation allowing user to navigate or try again latera
      setLinkingAcc({
        ...linkingAcc,
        connectStatus: {
          ...linkingAcc.connectStatus,
          accountLinkAttempted: false,
        },
      });
    } else if (latestAccLinkStatus.disconnectStatus.success) {
      // close modal confirmation allowing user to navigate away
      setLinkingAcc({
        ...linkingAcc,
        disconnectStatus: {
          ...linkingAcc.disconnectStatus,
          success: null,
          message: null,
        },
      });
    } else {
      // close disconnect error modal to reset and try again later
      setLinkingAcc({
        ...linkingAcc,
        disconnectStatus: {
          ...linkingAcc.disconnectStatus,
          error: null,
          message: null,
        },
      });
    }
    // close modal
    setIsOpen(false);
  }

  // conditional render of modal message(s)
  function detectModalMessage() {
    // display modal with linking details. Give user option to continue or cancel.
    if (latestAccLinkStatus.connectStatus.attemptingToLink) {
      return (
        <ModalDialog
          open={isOpen}
          close={closeModal}
          id="attemptingToLink"
          title="Connect your TD Ameritrade Account"
          status="Attempting to link account"
          description={
            <Typography
              component="div"
              variant="h5"
              classes={{ root: classes.dialogDescription }}
            >
              In order to connect your TD Ameritrade Account, you&apos;ll neeed
              to log in with your TD Ameritrade username and password. Please
              have those on hand and click connect when you&apos;re ready. You
              will be redirected to a trusted TD Ameritrade portal.
            </Typography>
          }
          buttonContent={
            <Box>
              <Button
                classes={{ root: classes.button }}
                variant="contained"
                onClick={linkTdAccount}
              >
                Link My TD Account
              </Button>
              <Button
                variant="contained"
                onClick={closeModal}
                classes={{
                  root: classes.button,
                  contained: classes.grayButton,
                }}
              >
                Cancel
              </Button>
            </Box>
          }
        />
      );
    } else if (latestAccLinkStatus.connectStatus.linkingInProgress) {
      // TD Ameritrade portal tab has been opened. User is in the process of authorizing and linking account
      return (
        <ModalDialog
          open={isOpen}
          close={closeModal}
          title="Account linking in progress..."
          status="Waiting on TD Ameritrade authorization"
          description={
            <Typography
              component="div"
              variant="h5"
              classes={{ root: classes.dialogDescription }}
            >
              {`Log in and authorize ${process.env.REACT_APP_NAME} to recieve your latest trading data. Only the necessary connection data is secured under your account, allowing ${process.env.REACT_APP_NAME} to read your latest trading history. Disconnecting this account in the future will remove all saved TD Ameritrade data, and clear all your transaction history.`}
            </Typography>
          }
          buttonContent={
            <Button
              variant="contained"
              classes={{
                root: classes.button,
                contained: classes.grayButton,
              }}
              onClick={closeModal}
            >
              Cancel Linking
            </Button>
          }
        />
      );
    } else if (latestAccLinkStatus.connectStatus.accountLinkAttempted) {
      // account link attempted - displays modal with success or failure message
      return (
        <ModalDialog
          open={isOpen}
          close={closeModal}
          title="Link TD Ameritrade"
          status={`${latestAccLinkStatus.urlLinkState.status}`}
          description={
            <Typography
              component="div"
              variant="h5"
              classes={{ root: classes.dialogDescription }}
            >
              {
                // self-invoking function to allow if-else statement in jsx
                (() => {
                  if (latestAccLinkStatus.urlLinkState.status === "Success!") {
                    return `${latestAccLinkStatus.urlLinkState.message}. Navigate to your dashboard screen to see your latest transactions`;
                  } else if (
                    latestAccLinkStatus.urlLinkState.status === "Error"
                  ) {
                    return `There was a problem linking your account. ${latestAccLinkStatus.urlLinkState.message} Please try again later.`;
                  } else {
                    return "";
                  }
                })()
              }
            </Typography>
          }
          buttonContent={
            <Button
              classes={{ button: classes.button }}
              variant="contained"
              onClick={closeModal}
            >
              Continue
            </Button>
          }
        />
      );
    } else if (latestAccLinkStatus.disconnectStatus.attemptingToDisconnect) {
      // user is in the process of disconnecting account
      return (
        <ModalDialog
          open={isOpen}
          close={closeModal}
          title="Disconnect your TD Ameritrade account"
          status={`Current connected status is: ${latestAccLinkStatus.isTdAccountLinked}`}
          description={
            <Typography>
              You will no longer be able to automatically sync your latest
              trades. Would you like to continue?
            </Typography>
          }
          buttonContent={
            <div>
              <Button
                classes={{ root: classes.button }}
                variant="contained"
                onClick={disconnectAccount}
              >
                {isLoading ? (
                  <div>
                    <CircularProgress
                      classes={{ root: classes.spinner }}
                      size={25}
                      variant="indeterminate"
                    />
                    <Typography>Disconnecting Account...</Typography>
                  </div>
                ) : (
                  "Disconnect Account"
                )}
              </Button>
              <Button
                classes={{
                  root: classes.button,
                  contained: classes.grayButton,
                }}
                variant="contained"
                onClick={closeModal}
              >
                Cancel
              </Button>
            </div>
          }
        />
      );
    } else if (latestAccLinkStatus.disconnectStatus.success) {
      // disconnected successfully
      return (
        <ModalDialog
          open={isOpen}
          close={closeModal}
          title="You've successfully disconnected your account!"
          status={`Connection Status: ${latestAccLinkStatus.isTdAccountLinked}`}
          description={
            <Typography>
              All connection details have been deleted. If you ever want to sync
              your trades again, just re-authorize by following the connect
              account details found on this page.
            </Typography>
          }
          buttonContent={
            <div>
              <Button
                classes={{
                  root: classes.button,
                  contained: classes.grayButton,
                }}
                variant="contained"
                onClick={closeModal}
              >
                Close
              </Button>
            </div>
          }
        />
      );
    } else if (latestAccLinkStatus.disconnectStatus.error) {
      // failed to disconnect
      return (
        <ModalDialog
          open={isOpen}
          close={closeModal}
          title="There was an error"
          status={`Account link connection status is: ${latestAccLinkStatus.isTdAccountLinked}`}
          description={
            <Typography>
              {`${latestAccLinkStatus.disconnectStatus.message}. \n`}
              Please hit cancel and try again later.
            </Typography>
          }
          buttonContent={
            <div>
              <Button
                classes={{
                  root: classes.button,
                  contained: classes.grayButton,
                }}
                variant="contained"
                onClick={closeModal}
              >
                Cancel
              </Button>
            </div>
          }
        />
      );
    } else {
      return null;
    }
  }

  return (
    <div>
      <Box>
        {/* conditionally handle which message to display in the modal */}
        {detectModalMessage()}
      </Box>
    </div>
  );
}

ModalDialog.propTypes = {
  open: PropTypes.bool,
  id: PropTypes.string,
  title: PropTypes.string,
  status: PropTypes.string,
  description: PropTypes.object,
  buttonContent: PropTypes.any,
};

LinkAccStatusModal.propTypes = {
  setLinkingAcc: PropTypes.func,
  linkingAcc: PropTypes.object,
};

CircularProgress.propTypes = {
  classes: PropTypes.any,
  className: PropTypes.object,
};
