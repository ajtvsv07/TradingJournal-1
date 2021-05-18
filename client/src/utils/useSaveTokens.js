import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import useErrorHandler from "./useErrorHandler";

function saveTokens(tdTokens, tdTokenStatus, clientToken) {
  const [savedTokens, setSavedTokens] = useState({
    savedTokens: null,
    savedTokenStatus: "fetching",
  });
  const cache = useRef({});
  const { clientAccessToken, status } = clientToken;
  const { user, isAuthenticated } = useAuth0();

  // TODO: do you need to verify "isAuthenticated" here before saving
  // TODO: get unique user identifier to save along with token data
  const handleError = useErrorHandler();

  useEffect(() => {
    const saveTdTokens = async () => {
      console.log({ user, isAuthenticated });
      if (isAuthenticated) {
        const res = await axios
          .post(
            `${process.env.REACT_APP_EXPRESS_API}/tda/updateAccStatusTokens`,
            {
              data: tdTokens,
              userId: user.sub,
            },
            {
              headers: { Authorization: `Bearer ${clientAccessToken}` },
            }
          )
          .catch((error) => {
            console.log("Catching error: ", error.message);
            handleError(error);
          });

        // cache resonse
        cache.current.savedTokens = res;
        // udpate State
        setSavedTokens({
          savedTokens: res,
          savedTokenStatus: "fetched",
        });
      }
    };
    console.log("TD Token Status: ", tdTokenStatus);
    if (tdTokenStatus === "fetched" && status === "fetched") {
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
  }, [tdTokenStatus]);

  return savedTokens;
}

export default saveTokens;
