import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import modalStyles from "./modalStyles";
import ModalDialog from "./ModalDialog";

export default function DisconnectSuccess({ linkingAcc, updateState }) {
  const classes = modalStyles();

  function handleCloseModal() {
    updateState({
      ...linkingAcc,
      isModalOpen: ((prevState) => !prevState)(),
      wasModalClosed: true,
      disconnectStatus: {
        ...linkingAcc.disconnectStatus,
        success: null,
        message: null,
        succeeded: true,
      },
    });
  }

  return (
    <ModalDialog
      open={linkingAcc.isModalOpen}
      close={handleCloseModal}
      title="You've successfully disconnected your account!"
      status={`Connection Status: ${linkingAcc.isTdAccountLinked}`}
      description={
        <Typography>
          {`${linkingAcc.disconnectStatus.message}. \n
              All connection details have been deleted. If you ever want to sync
              your trades again, just re-authorize by following the connect
              account details found on this page.`}
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
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </div>
      }
    />
  );
}

DisconnectSuccess.propTypes = {
  linkingAcc: PropTypes.object,
  updateState: PropTypes.func,
};
