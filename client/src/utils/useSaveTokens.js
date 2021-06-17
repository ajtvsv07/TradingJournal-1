import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useErrorHandler } from "react-error-boundary";

function saveTokens(tdTokens, tdTokenStatus, clientToken, tdAuthCode) {
  const [savedTokens, setSavedTokens] = useState({
    savedTokens: null,
    savedTokenStatus: "fetching",
  });
  const cache = useRef({});
  const { clientAccessToken, clientTokenStatus } = clientToken;
  const { user, isAuthenticated } = useAuth0();

  const handleError = useErrorHandler();

  useEffect(() => {
    // save tokens to database
    const saveTdTokens = async () => {
      if (isAuthenticated) {
        const res = await axios
          .post(
            `${process.env.REACT_APP_EXPRESS_API}/tda/updateAccStatusTokens`,
            {
              tdTokens,
              tdAuthCode,
              userId: user.sub,
            },
            {
              headers: { Authorization: `Bearer ${clientAccessToken}` },
            }
          )
          .catch((error) => {
            throw new Error("Request error: ", error);
          });
        // handle other errors with react-error-boundary
        if (!res.data.success) {
          const error = res.data;
          handleError(error);
        } else {
          // cache response and update state
          cache.current.savedTokens = res.data;
          setSavedTokens({
            savedTokens: res.data,
            savedTokenStatus: "fetched",
          });
        }
      }
    };

    if (tdTokenStatus === "fetched" && clientTokenStatus === "fetched") {
      if (cache.current.savedTokens) {
        const tokens = cache.current.savedTokens;
        console.log("Cached saved tokens: ", tokens);
        setSavedTokens({
          savedTokens: tokens,
          savedTokenStatus: "fetched",
        });
      } else {
        saveTdTokens();
      }
    }
  }, [tdTokenStatus, clientTokenStatus]);

  return savedTokens;
}

export default saveTokens;
