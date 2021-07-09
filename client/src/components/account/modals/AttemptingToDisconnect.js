import React, { useState } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import modalStyles from "./modalStyles";
import ModalDialog from "./ModalDialog";

import useDisconnectTdAccount from "../DisconnectTdAccount";

export default function AttemptingToDisconnect({ linkingAcc, updateState }) {
  const [isDisconnectingProgress, setIsDisconnectingProgress] = useState(false);
  const classes = modalStyles();
  const { data: disconnectResponse, isLoading } = useDisconnectTdAccount();

  function disconnectAccount() {
    setIsDisconnectingProgress(true);

    if (!isLoading && disconnectResponse) {
      // display error in new modal
      if (!disconnectResponse.success) {
        updateState({
          ...linkingAcc,
          disconnectStatus: {
            ...linkingAcc.disconnectStatus,
            attemptingToDisconnect: false,
            error: true,
            message: disconnectResponse.message,
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
            message: disconnectResponse.message,
          },
        });
        setIsDisconnectingProgress(false);
      }
    }
  }

  function handleCloseModal() {
    updateState({
      ...linkingAcc,
      isModalOpen: ((prevState) => !prevState)(),
      wasModalClosed: true,
      disconnectStatus: {
        ...linkingAcc.disconnectStatus,
        attemptingToDisconnect: false,
      },
    });
  }

  return (
    <ModalDialog
      open={linkingAcc.isModalOpen}
      close={handleCloseModal}
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
            onClick={handleCloseModal}
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
