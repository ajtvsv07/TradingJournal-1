import React from "react";
import PropTypes from "prop-types";
import { useAuth0 } from "@auth0/auth0-react";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import modalStyles from "./modalStyles";
import ModalDialog from "./ModalDialog";

export default function DisconnectError({ linkingAcc, updateState }) {
  const classes = modalStyles();
  const { user, getAccessTokenSilently } = useAuth0();

  getAccessTokenSilently({ ignoreCache: true });

  function handleCloseModal() {
    updateState({
      ...linkingAcc,
      isTdAccountLinked: user["https://tradingjournal/link-account"],
      isModalOpen: false,
      disconnectStatus: {
        ...linkingAcc.disconnectStatus,
        error: null,
        message: null,
      },
    });
  }

  return (
    <ModalDialog
      open={linkingAcc.isModalOpen}
      close={handleCloseModal}
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
            onClick={handleCloseModal}
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
