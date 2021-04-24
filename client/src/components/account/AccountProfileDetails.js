import React, { useState } from "react";
import {
  Button,
  Chip,
  List,
  ListItemText,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import PropTypes from "prop-types";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import useApi from "../../utils/useApi";

const useStyles = makeStyles((theme) => ({
  spinner: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(1),
    },
    color: "#ffffff",
  },
}));

const apiDetails = "";

// TODO: Look into re-sending email confirmation after user updates their email addresss

// TODO: Fix loading spinner size in button. Currently button changes size

const AccountProfileDetails = ({ ...rest }) => {
  const classes = useStyles();

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  console.log("User object", user);

  const [userDetails, setUserDetails] = useState({
    reqFeedback: false,
    loading: false,
    firstName: user["https://tradingjournal/first-name"],
    lastName: user["https://tradingjournal/last-name"],
    email: user.email,
    emailVerificationSent: true,

    username: user["https://tradingjournal/username"],
    id: user.sub,
    linkAccount: user["https://tradingjournal/link_account"],
  });

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
          "http://localhost:5000/user/updateAccount",
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
        .then((response) => {
          console.log("Patch response: ", response);
          return response.data.success
            ? getAccessTokenSilently({ ignoreCache: true }).then(() => {
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
              }));
        })
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

  const handleLinkAccountChange = () => {
    const previousSetting = user["https://tradingjournal/link_account"];
    console.log("isLinked setting was: ", previousSetting);
    // TODO: want to set this option to the opposite of what it was previously
    setUserDetails(() => ({
      ...userDetails,
      linkAccount: !previousSetting,
    }));
    setTimeout(() => {
      console.log("The new isLinked value is: ", userDetails.linkAccount);
    }, 1000);
  };

  return (
    isAuthenticated && (
      <>
        <form autoComplete="off" {...rest} onSubmit={callServerApi}>
          <Card>
            <CardHeader
              subheader="The information can be edited"
              title="Profile"
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
            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                p: 5,
              }}
            >
              <Grid container spacing={5}>
                <Grid item md={8} xs={12}>
                  {userDetails.reqFeedback ? (
                    <Typography>{userDetails.reqFeedback}</Typography>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                p: 2,
              }}
            >
              <Button color="primary" variant="contained" type="submit">
                {userDetails.loading ? (
                  <CircularProgress className={classes.spinner} />
                ) : (
                  "Save details"
                )}
              </Button>
            </Box>
          </Card>
        </form>
        <Box mb={10} />
        <form autoComplete="off" noValidate {...rest}>
          <Card>
            <CardHeader
              subheader="Manage your connection to TD Ameritrade in order to automatically sync your trades"
              title="Connect to TD Ameritrade"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={6} wrap="wrap">
                <Grid
                  item
                  md={12}
                  sm={6}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                  xs={12}
                >
                  <Typography color="text-primary" variant="h4">
                    User Account Details
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={userDetails.linkAccount}
                        onChange={handleLinkAccountChange}
                        name="linkAccount"
                        color="primary"
                      />
                    }
                    label={
                      userDetails.linkAccount ? (
                        <div>
                          <h3>ON</h3>
                          <Typography color="textPrimary" variant="h5">
                            I want to reap the benefits of automatic syncing.
                          </Typography>
                        </div>
                      ) : (
                        <div>
                          <h3>OFF</h3>
                          <Typography color="textPrimary" variant="h5">
                            I don&apos;t want to sync my trades.
                          </Typography>
                        </div>
                      )
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
        <Box mb={10} />
        <Card>
          <CardHeader title="Test API" />
          <Divider />
          <CardContent>
            <Grid container spacing={6} wrap="wrap">
              <Grid
                item
                md={12}
                sm={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
                xs={12}
              >
                <Typography color="text-primary" variant="h4">
                  API Details should display here:
                </Typography>
                <Box>
                  {apiDetails ? (
                    Object.entries(apiDetails).map((item) => (
                      <Typography>{item}</Typography>
                    ))
                  ) : (
                    <Typography>Nothing to show here yet</Typography>
                  )}
                </Box>
                <Box mt={4} />
                <Button variant="contained" onClick={callServerApi}>
                  Call server api
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </>
    )
  );
};

AccountProfileDetails.propTypes = {
  user: PropTypes.object,
  button: PropTypes.any,
};

export default AccountProfileDetails;
