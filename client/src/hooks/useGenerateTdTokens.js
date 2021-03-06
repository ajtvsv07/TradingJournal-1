/* eslint-disable no-else-return */
import axios from "axios";
import { useQuery } from "react-query";
import queryString from "query-string";
// import jsonSample from "../utils/jsonSample.json";

function generateTokens(
  linkDetails,
  linkDetailsLoading,
  linkDetailsError,
  tdAuthCode
) {
  const generateTdTokens = async () => {
    if (linkDetails && !linkDetailsLoading && !linkDetailsError && tdAuthCode) {
      const { redirectUri, clientId } = linkDetails.payload;

      // the dynamic values for this request should all be urldecoded
      const { data } = await axios
        .request({
          url: process.env.REACT_APP_TD_POST_ACCESS_TOKEN,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: queryString.stringify({
            grant_type: "authorization_code",
            refresh_token: "",
            access_type: "offline",
            code: tdAuthCode, // url decoded
            client_id: `${clientId}@AMER.OAUTHAP`, // url decoded
            redirect_uri: redirectUri, // url decoded
          }),
        })
        .catch((error) => {
          console.log("Error: td token request: ", error);
          throw new Error("Unable to generate tokens:", error.message);
        });

      // add timestamp to data
      data.createdOn = Date.now();

      return data;

      // // placeholder sample
      // const data = jsonSample;
      // return data;
    }
    throw new Error(
      "Error: Problem in getting link details. ",
      linkDetailsError
    );
  };

  return useQuery("generatedTdTokens", () => generateTdTokens(), {
    // The query will not execute until linkDetails exists
    enabled: !!linkDetails,
  });
}

export default generateTokens;
