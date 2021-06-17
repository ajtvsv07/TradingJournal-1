import React, { useState } from "react";

import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import NotInterestedIcon from "@material-ui/icons/NotInterested";

import axios from "axios";

import { useAuth0 } from "@auth0/auth0-react";

const useStyles = makeStyles((theme) => ({
  // TODO: Fix loading spinner size in button. Currently button changes size
  spinner: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(1),
    },
    color: "#ffffff",
  },
}));

// personal user account profile details (form)
const AccountProfileDetails = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const classes = useStyles();

  // console.log("Logging user object from AccountProfileDetails: ", user);

  const [userDetails, setUserDetails] = useState({
    reqFeedback: false,
    loading: false,
    firstName: user["https://tradingjournal/first-name"],
    lastName: user["https://tradingjournal/last-name"],
    email: user.email,
    emailVerificationSent: true,
    username: user["https://tradingjournal/username"],
    id: user.sub,
  });
  // update profile details
  const callServerApi = (event) => {
    event.preventDefault();
    setUserDetails({ ...userDetails, loading: true });
    let emailChanged = false;
    if (userDetails.email !== user.email) {
      emailChanged = true;
    }
    getAccessTokenSilently().then((token) => {
      axios
        .post(
          `${process.env.REACT_APP_EXPRESS_API}/account/updateUserDetails`,
          {
            data: {
              ...userDetails,
              newEmail: emailChanged,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) =>
          // console.log("POST response: ", response);
          response.data.success
            ? // getAccessTokenSilently again to recieve the most recent data that was just updated through server call
              getAccessTokenSilently({ ignoreCache: true }).then(() => {
                setUserDetails(() => ({
                  ...userDetails,
                  reqFeedback: response.data.message,
                  loading: false,
                }));
              })
            : setUserDetails(() => ({
                ...userDetails,
                reqFeedback: response.data.error.message,
                loading: false,
              }))
        )
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const handleUserDetailsChange = (event) => {
    setUserDetails({
      ...userDetails,
      [event.target.name]: event.target.value,
    });
  };

  return (
    isAuthenticated && (
      <>
        <Box mb={10}>
          <Card>
            <CardHeader
              title="Profile"
              subheader="The information can be edited"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={5}>
                <Grid item md={6} xs={12} pt={5}>
                  <TextField
                    fullWidth
                    label="First name"
                    name="firstName"
                    onChange={handleUserDetailsChange}
                    value={userDetails.firstName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12} pt={5}>
                  <TextField
                    fullWidth
                    label="Last name"
                    name="lastName"
                    onChange={handleUserDetailsChange}
                    value={userDetails.lastName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12} pt={5}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    onChange={handleUserDetailsChange}
                    required
                    value={userDetails.email}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12} pt={5}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    onChange={handleUserDetailsChange}
                    required
                    value={userDetails.username}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={5}
                direction="row"
                justify="flex-start"
                alignItems="center"
                pt={5}
              >
                <Grid item>
                  <Chip
                    label={
                      user.email_verified
                        ? "Email Verified: Yes"
                        : "Email Verified: No"
                    }
                    icon={
                      user.email_verified ? (
                        <CheckCircleIcon />
                      ) : (
                        <NotInterestedIcon />
                      )
                    }
                  />
                </Grid>
                <Grid item>
                  {!user.email_verified && userDetails.emailVerificationSent ? (
                    <Typography>
                      Email Verification has been sent. Please check your email
                      and verify
                    </Typography>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </CardContent>
            <Grid container spacing={5}>
              <Grid item md={8} xs={12}>
                {userDetails.reqFeedback ? (
                  <Typography>{userDetails.reqFeedback}</Typography>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                p: 2,
              }}
            >
              <Button
                color="primary"
                variant="contained"
                onClick={callServerApi}
              >
                {userDetails.loading ? (
                  <CircularProgress className={classes.spinner} />
                ) : (
                  "Save details"
                )}
              </Button>
            </Box>
          </Card>
        </Box>
      </>
    )
  );
};

export default AccountProfileDetails;
