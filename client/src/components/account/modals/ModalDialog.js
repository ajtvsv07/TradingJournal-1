import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";

const useStyles = makeStyles({
  button: {
    margin: "1.5rem 0 0",
    minWidth: "100%",
    marginBottom: "1rem",
  },
  grayButton: {
    backgroundColor: "#333",
  },
  spinner: {
    color: "#ffffff",
    margin: "0.7rem",
  },
  dialogTitle: {
    padding: "1rem 0",
    color: "#333333",
    fontWeight: "700",
  },
  dialogDescrition: {
    padding: "1rem 0",
    color: "#333333",
    fontWeight: "700",
  },
});

const style = {
  box: {
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  },
};

export default function ModalDialog({
  title,
  status,
  description,
  buttonContent,
  open,
}) {
  const classes = useStyles();
  return (
    <Dialog aria-labelledby="simple-dialog-title" open={open}>
      <Box sx={style.box}>
        <Typography
          component="div"
          variant="h2"
          align="left"
          classes={{ root: classes.dialogTitle }}
        >
          {title}
        </Typography>
        <Grid container>
          <div>
            <br />
          </div>
        </Grid>
        <Typography
          component="div"
          variant="h5"
          classes={{ root: classes.dialogStatus }}
        >
          {status}
        </Typography>
        <br />
        {description}
        <br />
        {buttonContent}
      </Box>
    </Dialog>
  );
}

ModalDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  status: PropTypes.string,
  description: PropTypes.object,
  buttonContent: PropTypes.any,
};
