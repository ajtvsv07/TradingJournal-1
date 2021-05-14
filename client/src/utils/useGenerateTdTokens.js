import { useState, useEffect, useRef } from "react";
import axios from "axios";

function generateTokens(linkDetails, status, authCode) {
  const [tokenState, setTokenState] = useState({
    tdTokens: null,
    tdTokenStatus: "fetching",
  });
  const cache = useRef({});

  useEffect(() => {
    // TODO: limit how many times a user can request tokens (max 1 time per day?)
    const generateTdTokens = () => {
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
      //     // ).catch((error)=> {
      //   throw new Error("Unable to generate tokens:", error.message);
      // });
      //     // console.log("Incoming token request response: ", res.data);

      // success placeholder
      const res = {
        access_token: "access_token",
        refresh_token: "refresh_token",
        token_type: "someTokenType",
        expires_in: 2300,
        scope: "some_scope another_scope",
        refresh_token_expires_in: 2300,
      };
      // cache resonse
      cache.current.tdTokens = res;
      // udpate State
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
        generateTdTokens();
      }
    }
  }, [status]);

  return tokenState;
}

export default generateTokens;
