import React, { useState } from "react";
import PropTypes from "prop-types";
import { useAuth0 } from "@auth0/auth0-react";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import modalStyles from "./modalStyles";
import ModalDialog from "./ModalDialog";

import disconnectTdAccount from "../DisconnectTdAccount";
import useGetAccessTokenSilently from "../../../utils/useGetAccessTokenSilently";

export default function AttemptingToDisconnect({ updateState, linkingAcc }) {
  const { user } = useAuth0();
  const [isOpen, setIsOpen] = useState(true);
  const [isDisconnectingProgress, setIsDisconnectingProgress] = useState(false);
  const classes = modalStyles();

  const { data: clientToken } = useGetAccessTokenSilently();

  function disconnectAccount() {
    setIsDisconnectingProgress(true);
    disconnectTdAccount(user, clientToken).then((response) => {
      // display error in new modal
      if (!response.success) {
        updateState({
          ...linkingAcc,
          disconnectStatus: {
            attemptingToDisconnect: false,
            error: true,
            message: response.message,
          },
        });
        setIsDisconnectingProgress(false);
      } else {
        // display success in new modal
        updateState({
          ...linkingAcc,
          disconnectStatus: {
            ...linkingAcc.disconnectStatus,
            attemptingToDisconnect: false,
            success: true,
            message: response.message,
          },
        });
        setIsDisconnectingProgress(false);
      }
    });
  }

  function closeModal() {
    updateState({
      ...linkingAcc,
      disconnectStatus: {
        ...linkingAcc.disconnectStatus,
        attemptingToDisconnect: false,
      },
    });
    setIsOpen(false);
  }

  return (
    <ModalDialog
      open={isOpen}
      close={closeModal}
      title="Disconnect your TD Ameritrade account"
      status={`Current connected status is: ${linkingAcc.isTdAccountLinked}`}
      description={
        <Typography>
          You will no longer be able to automatically sync your latest trades.
          Would you like to continue?
        </Typography>
      }
      buttonContent={
        <div>
          <Button
            classes={{ root: classes.button }}
            variant="contained"
            onClick={disconnectAccount}
          >
            {isDisconnectingProgress ? (
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
}

AttemptingToDisconnect.propTypes = {
  linkingAcc: PropTypes.object,
  updateState: PropTypes.func,
};
