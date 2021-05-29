import React from "react";
import axios from "axios";

import { useAuth0 } from "@auth0/auth0-react";
import useGetAuthLinkDetails from "../../utils/useGetAuthLinkDetails";

const DisconnectTdAccount = async (clientToken) => {
  console.log("Checking the client token first: ", clientToken);
  const { clientAccessToken, clientTokenStatus } = clientToken;

  const res = await axios
    .get(`${process.env.REACT_APP_EXPRESS_API}/tda/disconnectAccount`, {
      headers: { Authorization: `Bearer ${clientAccessToken}` },
    })
    .catch((error) => {
      // handled by react-error-boundary
      throw new Error(
        "Unable to disconnect account. Please try again later:",
        error.message
      );
    });

  console.log("Logging disconnectAccount response: ", res.data);
};

export default DisconnectTdAccount;
