import React, { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "react-query";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import modalStyles from "./modalStyles";
import ModalDialog from "./ModalDialog";

import useGetAccessTokenSilently from "../../../utils/useGetAccessTokenSilently";

export default function AttemptingToDisconnect({ linkingAcc, updateState }) {
  const [isDisconnectingProgress, setIsDisconnectingProgress] = useState(false);
  const { data: clientToken } = useGetAccessTokenSilently();
  const classes = modalStyles();
  const { user, getAccessTokenSilently } = useAuth0();
  const userId = user.sub;

  getAccessTokenSilently({ ignoreCache: true });

  function handleCloseModal() {
    updateState({
      ...linkingAcc,
      isTdAccountLinked: user["https://tradingjournal/link-account"],
      isModalOpen: false,
      disconnectStatus: {
        ...linkingAcc.disconnectStatus,
        attemptingToDisconnect: false,
      },
    });
  }

  const { isLoading, isError, mutateAsync } = useMutation(() =>
    axios.post(
      `${process.env.REACT_APP_EXPRESS_API}/tda/disconnectAccount`,
      {
        data: {
          user: userId,
        },
      },
      {
        headers: { Authorization: `Bearer ${clientToken}` },
      }
    )
  );

  async function disconnectAccount() {
    setIsDisconnectingProgress(true);
    if (!isLoading && !isError) {
      mutateAsync({ userId, clientToken })
        .then((result) => {
          console.log("Disconnect res from mutation: ", result);
          // get the latest isLinked state
          if (result.data.success) {
            setIsDisconnectingProgress(false);
            // display success message in new modal
            updateState({
              ...linkingAcc,
              isTdAccountLinked: user["https://tradingjournal/link-account"],
              disconnectStatus: {
                ...linkingAcc.disconnectStatus,
                attemptingToDisconnect: false,
                success: true,
                message: result.data.message,
              },
            });
          } else {
            setIsDisconnectingProgress(false);
            // display error in new modal
            updateState({
              ...linkingAcc,
              isTdAccountLinked: user["https://tradingjournal/link-account"],
              disconnectStatus: {
                ...linkingAcc.disconnectStatus,
                attemptingToDisconnect: false,
                error: true,
                message: result.data.message,
              },
            });
          }
        })
        .catch((error) => {
          throw new Error(
            `There was a network connection error: ${error}. Please try again later.`
          );
        });
    }
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
