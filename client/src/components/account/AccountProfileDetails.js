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
} from "@material-ui/core";
// import { makeStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import PropTypes from "prop-types";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import useApi from "../../utils/useApi";

// const useStyles = makeStyles((theme) => ({
//   avatarSize: {
//     width: theme.spacing(15),
//     height: theme.spacing(15),
//   },
//   avatarButton: {
//     marginLeft: theme.spacing(4),
//     textAlign: "left"
//   },
// }));
// const classes = useStyles();

const apiDetails = "";

// TODO: Remember to add the creation of the firstname and lastname
// to the hook that also creates the default metadata with the preferences

// TODO: Look into re-sending email confirmation after user updates their email addresss

// TODO: Changes don't take effect right after udpate, instead, only once page is reloaded, 
// user is logged out and asked to re-authenticate. Would be a better user experience if it happened automatically

const AccountProfileDetails = ({ ...rest }) => {

  const {
    user,
    isAuthenticated,
    getAccessTokenSilently,
    isLoading,
  } = useAuth0();
  
  console.log("User object: ", user);
  
  const [userDetails, setUserDetails] = useState({
    firstName: user["https://tradingjournal/first_name"],
    lastName: user["https://tradingjournal/last_name"],
    email: user.email,
    username: user["https://tradingjournal/username"],
    id: user.sub,
  });

  const [isLinked, setIsLinked] = useState({
    linkAccount: user["https://tradingjournal/link_account"]
  });

  const callServerApi = (event) => {
    event.preventDefault();
    console.log("Logging current state before sending the server request: ", userDetails);
    getAccessTokenSilently().then((token) => {
      axios
        .patch(
          "http://localhost:5000/user/updateAccount",
          {
            data: userDetails,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
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

  const handleLinkAccountChange = ()=>{
    const previousSetting = user["https://tradingjournal/link_account"];
    console.log("isLinked setting was: ", previousSetting)
    // TODO: want to set this option to the opposite of what it was previously
    setIsLinked((previousLinkSetting) => !previousLinkSetting);
    setTimeout(()=>{
      console.log("The new isLinked value is: ", isLinked)
    }, 1000);
  }

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
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="First name"
                    name="firstName"
                    onChange={handleUserDetailsChange}
                    required
                    value={userDetails.firstName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Last name"
                    name="lastName"
                    onChange={handleUserDetailsChange}
                    required
                    value={userDetails.lastName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
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
                <Grid item md={6} xs={12}>
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
                <Grid item md={6} xs={12}>
                  <Chip
                    label={
                      user.emailVerified
                        ? "Email Verified: Yes"
                        : "Email Verified: No"
                    }
                    icon={
                      user.emailVerified ? (
                        <CheckCircleIcon />
                      ) : (
                        <NotInterestedIcon />
                      )
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                p: 2,
              }}
            >
              <Button color="primary" variant="contained" type="submit">
                Save details
              </Button>
              {isLoading ? (
                <Typography>Loading...</Typography>
              ): ""}
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
                        checked={isLinked.linkAccount}
                        onChange={handleLinkAccountChange}
                        name="linkAccount"
                        color="primary"
                      />
                    }
                    label={
                      isLinked.linkAccount ? (
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
