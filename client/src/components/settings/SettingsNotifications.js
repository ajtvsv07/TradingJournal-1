import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from "@material-ui/core";

// TODO: Link the "connect TDA settings" to Auth0's user metadata
// 1 - Instead of using state - pull from auth0's object
// 2 - Create method for updating only that specific portion of the user_metadata
// 3 - When turned on, Reveal other questions/next steps for the user to connect to their account
//    • Don't actually update the user_metadata just yet, until account is successfully link (User can cancel the process at any time)
// 4 - When turned off, disconnect and unmount that portion of the UI
//    • Watch for memory leaks as that node is created and destroyed

export default function SettingsNotifications(props) {
  const [state, setState] = React.useState({
    linkAccount: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    console.log("Latest check event: ", event.target.checked);
  };

  return (
    <form {...props}>
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
                    checked={state.linkAccount}
                    onChange={handleChange}
                    name="linkAccount"
                    color="primary"
                  />
                }
                label={
                  state.linkAccount ? (
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
  );
}
