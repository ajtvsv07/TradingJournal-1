import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import classes from "./modalStyles";
import ModalDialog from "./ModalDialog";

export default function AttemptingToLink({ linkingAcc, updateState }) {
  const modalStyles = classes();
  const { user, getAccessTokenSilently } = useAuth0();

  async function linkTdAccount() {
    getAccessTokenSilently().then(async (clientToken) => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_EXPRESS_API}/tda/tdUrlDetails`,
        {
          headers: { Authorization: `Bearer ${clientToken}` },
        }
      );

      if (data.error) {
        throw new Error("Unable to generate tokens:", data.error.message);
      }

      // generate td auth link for user authorization
      const { clientId, redirectUri } = data.payload;
      const baseURl = process.env.REACT_APP_TD_AUTH_BASE_URL;
      const endUrl = process.env.REACT_APP_TD_AUTH_END_URL;
      const uri = encodeURIComponent(redirectUri);
      window.open(`${baseURl + uri}&client_id=${clientId + endUrl}`);
      updateState({
        ...linkingAcc,
        connectStatus: {
          ...linkingAcc.connectStatus,
          attemptingToLink: false,
          linkingInProgress: true,
        },
      });
    });
  }

  function handleCloseModal() {
    updateState({
      ...linkingAcc,
      isTdAccountLinked: user["https://tradingjournal/link-account"],
      isModalOpen: false,
      connectStatus: {
        ...linkingAcc.connectStatus,
        attemptingToLink: false,
      },
    });
  }

  return (
    <ModalDialog
      open={linkingAcc.isModalOpen}
      onClose={handleCloseModal}
      id="attemptingToLink"
      title="Connect your TD Ameritrade Account"
      status="Attempting to link account"
      description={
        <Typography
          component="div"
          variant="h5"
          classes={{ root: modalStyles.dialogDescription }}
        >
          In order to connect your TD Ameritrade Account, you&apos;ll neeed to
          log in with your TD Ameritrade username and password. Please have
          those on hand and click connect when you&apos;re ready. You will be
          redirected to a trusted TD Ameritrade portal.
        </Typography>
      }
      buttonContent={
        <Box>
          <Button
            classes={{ root: modalStyles.button }}
            variant="contained"
            onClick={linkTdAccount}
          >
            Link My TD Account
          </Button>
          <Button
            variant="contained"
            onClick={handleCloseModal}
            classes={{
              root: modalStyles.button,
              contained: modalStyles.grayButton,
            }}
          >
            Cancel
          </Button>
        </Box>
      }
    />
  );
}

AttemptingToLink.propTypes = {
  linkingAcc: PropTypes.object,
  updateState: PropTypes.func,
};
