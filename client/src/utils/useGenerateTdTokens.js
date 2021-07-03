import axios from "axios";
import { useQuery } from "react-query";

const resSample = require("./jsonSample.json");

function generateTokens(linkDetails, linkDetailsError, tdAuthCode) {
  if (!linkDetailsError) {
    // returns fetch promise
    const generateTdTokens = async () => {
      const { redirectUri, clientId } = linkDetails.payload;

      // const { data } = await axios
      //   .post(`${process.env.REACT_APP_TD_POST_ACCESS_TOKEN}`, {
      //     data: JSON.stringify({
      //       grant_type: "authorization_code",
      //       refresh_token: "",
      //       access_type: "offline",
      //       code: tdAuthCode,
      //       client_id: clientId,
      //       redirect_uri: redirectUri,
      //     }),
      //     headers: {
      //       "Content-Type": "application/x-www-form-urlencoded",
      //     },
      //   })
      //   .catch((error) => {
      //     throw new Error("Unable to generate tokens:", error.message);
      //   });

      // return data;

      // success placeholder
      const res = resSample;
      return res;
    };

    return useQuery("generatedTdTokens", () => generateTdTokens(), {
      // The query will not execute until clientToken exists
      enabled: !!linkDetails,
    });
  }

  throw new Error("Error: Couldn't get link details");
}

export default generateTokens;
