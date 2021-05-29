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
    color: "#6ad891",
    fontWeight: "700",
  },
  button: {
    margin: "1.5rem 0 0",
    minWidth: "100%",
  },
};

// TODO: if dialog status === "success", dialogMessage is green. Else, it's red.

function SimpleDialog({ onClose, linkedStatus, message, open }) {
  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <Box sx={style.box}>
        <Typography sx={style.dialogTitle}>{linkedStatus}</Typography>
        <Typography sx={style.dialogMessage}> {message}</Typography>
        {linkedStatus === "Success!" ? (
          <Typography variant="h4">
            Navigate to your dashboard screen to see your latest transactions.
          </Typography>
        ) : (
          <Typography variant="h4">
            There was a problem linking your account. Please try again later.
          </Typography>
        )}
        <Button sx={style.button} variant="contained" onClick={onClose}>
          Continue
        </Button>
      </Box>
    </Dialog>
  );
}

export default function SimpleDialogDemo({ message, linkedStatus }) {
  const [open, setOpen] = React.useState(true);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Box>
        <SimpleDialog
          open={open}
          message={message}
          linkedStatus={linkedStatus}
          onClose={handleClose}
        />
      </Box>
    </div>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  message: PropTypes.string,
  linkedStatus: PropTypes.string,
};

SimpleDialogDemo.propTypes = {
  message: PropTypes.string,
  linkedStatus: PropTypes.string,
};
