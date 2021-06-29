import React, { useState } from "react";
import PropTypes from "prop-types";

import { useAuth0 } from "@auth0/auth0-react";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import modalStyles from "./modalStyles";
import ModalDialog from "./ModalDialog";

export default function DisconnectSuccess({ linkingAcc, isOpen, closeModal }) {
  const { user } = useAuth0();
  const classes = modalStyles();

  function handleCloseModal() {
    closeModal({
      ...linkingAcc,
      isTdAccountLinked: user["https://tradingjournal/link-account"],
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
      open={isOpen}
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
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func,
};
