import { Helmet } from "react-helmet-async";
import { Box, Container, Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { ErrorBoundary } from "react-error-boundary";
import PropTypes from "prop-types";
import HandleTdAuthCode from "../components/account/HandleTdAuthCode";

const Account = () => {
  function ErrorFallback({error}) {
    return (
      <Container maxWidth="lg">
        <Grid container>
          <Grid item>
            <div role="alert">
              <Typography variant="h3" mb={2}>
                Error:
              </Typography>
              <hr />
              <Typography variant="h5" mt={4}>
                {error.message}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Container>
    );
  }

  ErrorFallback.propTypes = {
    error: PropTypes.object,
  };

  return (
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
            <Grid item lg={12} md={6} xs={12}>
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
              >
                <HandleTdAuthCode />
              </ErrorBoundary>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Account;
