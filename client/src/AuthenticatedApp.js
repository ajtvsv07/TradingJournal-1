import "react-perfect-scrollbar/dist/css/styles.css";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import { ReactQueryDevtools } from "react-query/devtools";
import { StylesProvider, jssPreset } from "@material-ui/core/styles";
import { create } from "jss";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "react-query";
import GlobalStyles from "./components/GlobalStyles";
import "./mixins/chartjs";
import theme from "./theme";
import routes from "./routes";

const helmetContext = {};
const queryClient = new QueryClient();

const jss = create({
  ...jssPreset(),
  // Define a custom insertion point that JSS will look for when injecting the styles into the DOM.
  insertionPoint: document.getElementById("jss-insertion-point"),
});

const AuthenticatedApp = () => {
  const routing = useRoutes(routes);

  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <HelmetProvider context={helmetContext}>
          <QueryClientProvider client={queryClient}>
            {routing}
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </HelmetProvider>
      </ThemeProvider>
    </StylesProvider>
  );
};

export default AuthenticatedApp;
