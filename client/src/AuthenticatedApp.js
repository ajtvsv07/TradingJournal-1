import { HelmetProvider } from "react-helmet-async";

import { useRoutes } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { StylesProvider, jssPreset, ThemeProvider } from "@material-ui/styles";
import {create} from "jss"

import "./mixins/chartjs";
import theme from "./theme";
import GlobalStyles from "./components/GlobalStyles";
import "react-perfect-scrollbar/dist/css/styles.css";

import routes from "./routes";

const helmetContext = {};
const queryClient = new QueryClient();

const jss = create({
  ...jssPreset(),
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
