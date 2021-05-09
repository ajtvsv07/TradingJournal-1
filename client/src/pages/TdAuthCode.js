import { Helmet } from "react-helmet-async";
import { Box, Container, Grid } from "@material-ui/core";
import HandleTdAuthCode from "../components/account/HandleTdAuthCode";

const Account = () => (
  <>
    <Helmet>
      <title>Authorizing TD | Trading Journal</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100%",
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item lg={4} md={6} xs={12}>
            <HandleTdAuthCode />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

export default Account;
