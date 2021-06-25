import React, { useState } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import modalStyles from "./modalStyles";
import ModalDialog from "./ModalDialog";

export default function LinkingInProgress({ linkingAcc, updateState }) {
  const [isOpen, setIsOpen] = useState(true);
  const classes = modalStyles();

  function closeModal() {
    updateState({
      ...linkingAcc,
      connectStatus: {
        ...linkingAcc.connectStatus,
        linkingInProgress: false,
      },
    });
    setIsOpen(false);
  }

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
}

LinkingInProgress.propTypes = {
  linkingAcc: PropTypes.object,
  updateState: PropTypes.func,
};
