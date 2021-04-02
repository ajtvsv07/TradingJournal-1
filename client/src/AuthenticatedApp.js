import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import { HelmetProvider } from 'react-helmet-async';

const helmetContext = {};

const AuthenticatedApp = () => {
  const routing = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <HelmetProvider context={helmetContext}>{routing}</HelmetProvider>
    </ThemeProvider>
  );
};

export default AuthenticatedApp;
