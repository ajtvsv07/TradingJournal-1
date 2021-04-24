import * as React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import * as serviceWorker from "./serviceWorker";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-deltanorth46.auth0.com"
      clientId="8xQPY1YK4ZwYwjnp0lrvkNny0zQSCZg1"
      redirectUri={window.location.origin}
      audience="http://localhost:5000"
      scope="read:current_user update:current_user_metadata"
      useRefreshTokens="true"
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
