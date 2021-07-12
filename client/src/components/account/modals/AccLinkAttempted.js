import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useAuth0 } from "@auth0/auth0-react";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import modalStyles from "./modalStyles";
import ModalDialog from "./ModalDialog";

export default function AccLinkAttempted({ linkingAcc, updateState }) {
  const classes = modalStyles();
  const { user, getAccessTokenSilently } = useAuth0();

  // refresh ui after server update
  useMemo(() => getAccessTokenSilently({ ignoreCache: true }), []);

  function handleCloseModal() {
    updateState({
      ...linkingAcc,
      isTdAccountLinked: user["https://tradingjournal/link-account"],
      isModalOpen: false,
      connectStatus: {
        ...linkingAcc.connectStatus,
        accountLinkAttempted: false, // needs to be a Bool
      },
    });
  }

  return (
    <ModalDialog
      open={linkingAcc.isModalOpen}
      close={handleCloseModal}
      title="Link TD Ameritrade"
      status={`${linkingAcc.urlLinkState.status}`}
      description={
        <Typography
          component="div"
          variant="h5"
          classes={{ root: classes.dialogDescription }}
        >
          {
            // self-invoking function to allow if-else statement in jsx
            (() => {
              if (linkingAcc.urlLinkState.status === "Success!") {
                return `${linkingAcc.urlLinkState.message}. Navigate to your dashboard screen to see your latest transactions`;
              }
              if (linkingAcc.urlLinkState.status === "Error") {
                return `There was a problem linking your account. ${linkingAcc.urlLinkState.message} Please try again later. If that still doesn't work, please contact site admin.`;
              }
              return "";
            })()
          }
        </Typography>
      }
      buttonContent={
        <Button
          classes={{ button: classes.button }}
          variant="contained"
          onClick={handleCloseModal}
        >
          Continue
        </Button>
      }
    />
  );
}

AccLinkAttempted.propTypes = {
  linkingAcc: PropTypes.object,
  updateState: PropTypes.func,
};
