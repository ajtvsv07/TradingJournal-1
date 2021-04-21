import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  default: {
    color: "red",
    paddingLeft: theme.spacing(8),
  },
});

const AccountButton = ({ classes, children }) => (
  <Button className={classes.default}>{children}</Button>
);

AccountButton.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.any
}

export default withStyles(styles)(AccountButton);