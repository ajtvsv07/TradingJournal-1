import React, { useState } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import { useAuth0 } from "@auth0/auth0-react";

import classes from "./modalStyles";
import ModalDialog from "./ModalDialog";

import useGetAccessTokenSilently from "../../../utils/useGetAccessTokenSilently";
import useGetAuthLinkDetails from "../../../utils/useGetAuthLinkDetails";

export default function AttemptingToLink({ linkingAcc, updateState }) {
  const modalStyles = classes();
  const [isLoading, setIsLoading] = useState(false);

  const { user, getAccessTokenSilently } = useAuth0();

  const { data: clientToken } = useGetAccessTokenSilently();
  const { data: authLink } = useGetAuthLinkDetails(clientToken);

  console.log("ATTEMPTINGTOLINK component rendering: ", linkingAcc);

  async function linkTdAccount() {
    // generate td auth link for user authorization
    const { clientId, redirectUri } = await authLink.payload;
    const baseURl = process.env.REACT_APP_TD_AUTH_BASE_URL;
    const endUrl = process.env.REACT_APP_TD_AUTH_END_URL;
    window.open(`${baseURl + redirectUri}&client_id=${clientId + endUrl}`);
    updateState({
      ...linkingAcc,
      connectStatus: {
        ...linkingAcc.connectStatus,
        attemptingToLink: false,
        linkingInProgress: true,
      },
    });
  }

  function handleCloseModal() {
    setIsLoading(true);
    // sync with latest linked status - get the latest source of truth from server
    getAccessTokenSilently({ ignoreCache: true }).then(() => {
      updateState({
        ...linkingAcc,
        isTdAccountLinked: user["https://tradingjournal/link-account"],
        isModalOpen: ((prevState) => !prevState)(),
        connectStatus: {
          ...linkingAcc.connectStatus,
          attemptingToLink: false,
        },
      });
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
            {isLoading ? (
              <div>
                <CircularProgress
                  classes={{ root: classes.spinner }}
                  size={25}
                  variant="indeterminate"
                />
                <Typography>Cancelling...</Typography>
              </div>
            ) : (
              "Cancel"
            )}
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
