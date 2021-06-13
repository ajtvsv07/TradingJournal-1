/* eslint-disable no-else-return */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import CircularProgress from "@material-ui/core/CircularProgress";

import { useAuth0 } from "@auth0/auth0-react";
import useGetAccessTokenSilently from "../../utils/useGetAccessTokenSilently";

import disconnectTdAccount from "./DisconnectTdAccount";

const style = {
  box: {
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
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
  button: {
    margin: "1.5rem 0 0",
    minWidth: "100%",
  },
  spinner: {
    display: "flex",
    "& > * + *": {
      marginLeft: "1rem",
    },
    color: "#ffffff",
  },
};

function ModalDialog({ title, status, description, buttonContent, open }) {
  return (
    <Dialog aria-labelledby="simple-dialog-title" open={open}>
      <Box sx={style.box}>
        <Typography
          component="div"
          variant="h2"
          align="left"
          sx={style.dialogTitle}
        >
          {title}
        </Typography>
        <Grid container>
          <div>
            <br />
          </div>
        </Grid>
        <Typography component="div" variant="h5" sx={style.dialogStatus}>
          {status}
        </Typography>
        <br />
        <Typography component="div" variant="h4" sx={style.dialogDescription}>
          {description}
        </Typography>
        {buttonContent}
      </Box>
    </Dialog>
  );
}

ModalDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  status: PropTypes.string,
  description: PropTypes.string,
  buttonContent: PropTypes.any,
};

export default function LinkAccStatusModal({ linkingAcc, setLinkingAcc }) {
  const { user } = useAuth0();
  const { clientToken } = useGetAccessTokenSilently();
  const [isLoading, setIsLoading] = useState(false);
  const [latestAccLinkStatus, setLatestAccLinkStatus] = useState(linkingAcc);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // open modal on every re-render
    setIsOpen(true);

    // clear is loading status in case connection times out
    setIsLoading(false);

    // ensure status data is always up to do date
    if (latestAccLinkStatus !== linkingAcc) {
      setLatestAccLinkStatus(linkingAcc);
    }
  }, [linkingAcc]);

  function handleClose() {
    if (latestAccLinkStatus.attemptingToDisconnect) {
      console.log("Attempt to disconnect account was canceled");
      setLinkingAcc({
        ...linkingAcc,
        attemptingToDisconnect: !linkingAcc.attemptingToDisconnect,
      });
    } else {
      console.log("Attempt to link account was canceled");
      setLinkingAcc({
        ...linkingAcc,
        attemptingToLink: !linkingAcc.attemptingToLink,
      });
    }

    setIsOpen(false);
  }

  function disconnectAccount() {
    setIsLoading(true);

    // call disconnect function
    disconnectTdAccount(user, clientToken).then((response) => {
      // TODO: update parent component status on either success or failure
      console.log("Logging disconnectAccount promise response: ", response);
    });
  }

  // display modal message
  function detectModalMessage() {
    // conditional render of modal message(s)
    // user is in the process of trying to link their td ameritrade account
    if (latestAccLinkStatus.attemptingToLink) {
      return (
        <ModalDialog
          open={isOpen}
          close={handleClose}
          title={`Attempting to link: ${latestAccLinkStatus.attemptingToLink}`}
          status="Link in progress"
          description="Please complete linking your account or cancel the process by clicking below"
          buttonContent="Cancel linking account"
        />
      );
    } else if (latestAccLinkStatus.accountLinkAttempted) {
      // account link attempted - displays success or failure message
      return (
        <ModalDialog
          open={isOpen}
          close={handleClose}
          title="Attempted to link TD Ameritrade account"
          status={`${latestAccLinkStatus.linkState.status}`}
          // description={latestAccLinkStatus.linkState.message}
          description={(() => {
            if (latestAccLinkStatus.linkState.status === "Success!") {
              return "Navigate to your dashboard screen to see your latest transactions";
            } else if (latestAccLinkStatus.linkState.status === "Error") {
              return "There was a problem linking your account. Please try again later.";
            } else {
              return "";
            }
          })()}
          buttonContent={
            <Button sx={style.button} variant="contained" onClick={handleClose}>
              Continue
            </Button>
          }
        />
      );
    } else if (latestAccLinkStatus.attemptingToDisconnect) {
      // user is in the process of disconnecting account
      return (
        <ModalDialog
          open={isOpen}
          close={handleClose}
          title="Disconnect your TD Ameritrade account"
          status={`Current connected status is: ${latestAccLinkStatus.isTdAccountLinked}`}
          description="You will no longer be able to automatically sync your latest trades. Would you like to continue?"
          buttonContent={
            <div>
              <Button
                sx={style.button}
                variant="contained"
                onClick={disconnectAccount}
              >
                {isLoading ? (
                  <div>
                    <CircularProgress classes={style.spinner} />
                    <Typography>Disconnecting Account...</Typography>
                  </div>
                ) : (
                  "Disconnect Account"
                )}
              </Button>
              <Button
                sx={style.button}
                variant="contained"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          }
        />
      );
    } else {
      // TODO: handle this case
      return null;
    }
  }

  return (
    <div>
      <Box>
        {/* handle which message to display in the modal */}
        {detectModalMessage()}
      </Box>
    </div>
  );
}

LinkAccStatusModal.propTypes = {
  setLinkingAcc: PropTypes.func,
  linkingAcc: PropTypes.object,
};
