import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { useAuth0 } from "@auth0/auth0-react";

// profile picture and user details card
const AccountProfile = ({ ...rest }) => {
  const { user, isAuthenticated } = useAuth0();
  return (
    isAuthenticated && (
      <Card {...rest}>
        <CardContent>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Avatar
              src={user.picture}
              sx={{
                height: 100,
                width: 100,
              }}
            />
            <Typography color="textPrimary" gutterBottom variant="h3">
              {user["https://tradingjournal/username"]}
            </Typography>
            <Typography color="textSecondary" variant="body1">
              Senior Developer
            </Typography>
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          <Button color="primary" fullWidth variant="text">
            Edit Photo
          </Button>
        </CardActions>
      </Card>
    )
  );
};

AccountProfile.propTypes = {
  user: PropTypes.any,
  avatarPicture: PropTypes.array,
};

export default AccountProfile;
