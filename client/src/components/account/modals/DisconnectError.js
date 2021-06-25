import React, { useState } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import modalStyles from "./modalStyles";
import ModalDialog from "./ModalDialog";

export default function DisconnectError({ linkingAcc, updateState }) {
  const [isOpen, setIsOpen] = useState(true);
  const classes = modalStyles();

  function closeModal() {
    updateState({
      ...linkingAcc,
      disconnectStatus: {
        ...linkingAcc.disconnectStatus,
        error: null,
        message: null,
      },
    });
    setIsOpen(false);
  }

  return (
    <ModalDialog
      open={isOpen}
      close={closeModal}
      title="There was an error"
      status={`Account link connection status is: ${linkingAcc.isTdAccountLinked}`}
      description={
        <Typography>
          {`${linkingAcc.disconnectStatus.message}. \n`}
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
}

DisconnectError.propTypes = {
  linkingAcc: PropTypes.object,
  updateState: PropTypes.func,
};
