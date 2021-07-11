import React from "react";
import PropTypes from "prop-types";
import { useAuth0 } from "@auth0/auth0-react";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import modalStyles from "./modalStyles";
import ModalDialog from "./ModalDialog";

export default function DisconnectSuccess({ linkingAcc, updateState }) {
  const classes = modalStyles();
  const { user, getAccessTokenSilently } = useAuth0();

  // get latest isLinked State from auth0
  getAccessTokenSilently({ ignoreCache: true });

  function handleCloseModal() {
    updateState({
      ...linkingAcc,
      isTdAccountLinked: user["https://tradingjournal/link-account"],
      isModalOpen: false,
      disconnectStatus: {
        ...linkingAcc.disconnectStatus,
        success: null,
        message: null,
      },
    });
  }

  return (
    <ModalDialog
      open={linkingAcc.isModalOpen}
      close={handleCloseModal}
      title="You've successfully disconnected your account!"
      status={`Connection Status: ${false}`}
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
