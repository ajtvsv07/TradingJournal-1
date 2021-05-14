import { useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

function useGenerateTokens(linkDetails, status, authCode) {
  const [tokenState, setTokenState] = useState({
    tdTokens: null,
    tdTokenStatus: "fetching",
  });
  const cache = useRef({});

  useEffect(() => {
    //   // TODO: limit how many times a user can request tokens (max 1 time per day?)
    // if (!linkDetails) return;
    const generateTokens = () => {
      const { redirectUri, clientId } = linkDetails.data.payload;
      // console.log("Authcode: ", authCode);
      //     // const res = await axios.POST(
      //     //   `${process.env.REACT_APP_TD_POST_ACCESS_TOKEN}`,
      //     //   {
      //     //     data: JSON.stringify({
      //     //       grant_type: "authorization_code",
      //     //       refresh_token: "",
      //     //       access_type: "offline",
      //     //       code: authCode,
      //     //       client_id: clientId,
      //     //       redirect_uri: redirectUri,
      //     //     }),
      //     //     headers: {
      //     //       "Content-Type": "application/x-www-form-urlencoded",
      //     //     },
      //     //   }
      //     // );
      //     // console.log("Incoming token request response: ", res.data);

      //     // success placeholder
      const res = {
        access_token: "access_token",
        refresh_token: "refresh_token",
        token_type: "someTokenType",
        expires_in: 2300,
        scope: "some_scope another_scope",
        refresh_token_expires_in: 2300,
      };
      cache.current.tdTokens = res;
      setTokenState({
        tdTokens: res,
        tdTokenStatus: "fetched",
      });
    };

    if (status === "fetched") {
      if (cache.current.tdTokens) {
        const tokens = cache.current.tdTokens;
        setTokenState({
          tdTokens: tokens,
          tdTokenStatus: "fetched",
        });
      } else {
        generateTokens();
      }
    }
  }, [status]);

  return tokenState;
}

export default useGenerateTokens;
