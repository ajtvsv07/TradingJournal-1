import { useRoutes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ErrorBoundary } from "react-error-boundary";

import { StylesProvider, jssPreset, ThemeProvider } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import { Container, Grid } from "@material-ui/core";
import PropTypes from "prop-types";

import { create } from "jss";
import "./mixins/chartjs";
import theme from "./theme";
import GlobalStyles from "./components/GlobalStyles";
import "react-perfect-scrollbar/dist/css/styles.css";
import routes from "./routes";

const AuthenticatedApp = () => {
  const routing = useRoutes(routes);
  const helmetContext = {};
  const queryClient = new QueryClient();

  const jss = create({
    ...jssPreset(),
    insertionPoint: document.getElementById("jss-insertion-point"),
  });

  // use for React-Error-Boundary
  function ErrorFallback({ error }) {
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
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <HelmetProvider context={helmetContext}>
          <QueryClientProvider client={queryClient}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              {routing}
            </ErrorBoundary>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </HelmetProvider>
      </ThemeProvider>
    </StylesProvider>
  );
};

export default AuthenticatedApp;
