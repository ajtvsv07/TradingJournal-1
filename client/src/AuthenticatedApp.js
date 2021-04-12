import "react-perfect-scrollbar/dist/css/styles.css";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import GlobalStyles from "src/components/GlobalStyles";
import "src/mixins/chartjs";
import theme from "src/theme";
import routes from "src/routes";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const helmetContext = {};
const queryClient = new QueryClient();

const AuthenticatedApp = () => {
  const routing = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          {routing}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default AuthenticatedApp;
