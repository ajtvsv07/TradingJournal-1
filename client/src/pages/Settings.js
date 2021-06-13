import { Helmet } from "react-helmet-async";
import { Box, Container } from "@material-ui/core";
import SettingsNotifications from "../components/settings/SettingsNotifications";

const SettingsView = () => (
  <>
    <Helmet>
      <title>Settings | Trading Journal</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100%",
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <SettingsNotifications />
        {/* <Box sx={{ pt: 3 }}>
          <SettingsPassword />
        </Box> */}
      </Container>
    </Box>
  </>
);

export default SettingsView;
