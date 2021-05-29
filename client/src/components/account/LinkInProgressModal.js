import * as React from "react";
import PropTypes from "prop-types";
import { Button, Box, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";

const style = {
  box: {
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  },
  dialogTitle: {
    padding: "1rem 0",
    color: "#545454",
    fontWeight: "700",
    textAlign: "center",
  },
  dialogMessage: {
    padding: "1rem 0",
    color: "#545454",
    fontWeight: "700",
  },
  button: {
    margin: "1.5rem 0 0",
    minWidth: "100%",
  },
};

// TODO: if dialog status === "success", dialogMessage is green. Else, it's red.

function LinkInProgressDialog({ open, onClose }) {
  return (
    <Dialog aria-labelledby="simple-dialog-title" open={open}>
      <Box sx={style.box}>
        <Typography sx={style.dialogTitle}>Link in progress...</Typography>
        <Typography sx={style.dialogMessage}>
          Please complete linking your account or cancel the process by clicking
          below
        </Typography>
        <Button sx={style.button} variant="contained" onClick={onClose}>
          Cancel linking account
        </Button>
      </Box>
    </Dialog>
  );
}

export default function AttemptingToLinkDialog({ setLinkingAcc, linkingAcc }) {
  console.log("Rendering AttemptingToLinkDialog");
  // set modal open as default
  let isOpen = true;

  const handleClose = () => {
    setLinkingAcc({
      ...linkingAcc,
      attemptingToLink: false,
    });
    isOpen = false;
  };

  return (
    <div>
      <Box>
        <LinkInProgressDialog open={isOpen} onClose={handleClose} />
      </Box>
    </div>
  );
}

LinkInProgressDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
AttemptingToLinkDialog.propTypes = {
  setLinkingAcc: PropTypes.func,
  linkingAcc: PropTypes.object,
};
