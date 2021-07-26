import axios from "axios";
import { useQuery } from "react-query";
import { useAuth0 } from "@auth0/auth0-react";
import generateTdRefreshToken from "./generateTdRefreshToken";

function getAccessTokens() {
  const { user, getAccessTokenSilently } = useAuth0();

  const getTokens = async () => {
    const getClientToken = await getAccessTokenSilently();
    const { data } = await axios.post(
      `${process.env.REACT_APP_EXPRESS_API}/tda/tdAccessTokens`,
      {
        userId: user.sub,
      },
      {
        headers: { Authorization: `Bearer ${getClientToken}` },
      }
    );
    if (!data.success) {
      throw new Error("Unable to generate tokens:", data.message);
    }
    return data;
  };

  return useQuery("retrieveAccessTokens", () => getTokens());
}

function tknDataValues() {
  const dataValues = {};

  // format time for expiration and refresh
  function expiresIn(expInSeconds) {
    if (expInSeconds <= 0) {
      return `00d: 00h: 00m`;
    }

    const exp = Number(expInSeconds); // provided in seconds
    const d = Math.floor(exp / (3600 * 24));
    const h = Math.floor((exp % (3600 * 24)) / 3600);
    const m = Math.floor((exp % 3600) / 60);

    const expIn = `${d}d: ${h}h: ${m}m`;
    return expIn;
  }

  // calculate time left to refresh token
  function refreshingIn(secondsToExp, timestamp, loading) {
    if (!loading) {
      const receivedOn = Math.floor(timestamp / 1000).toFixed(0); // convert from milliseconds to seconds
      const currentTime = (Date.now() / 1000).toFixed(0);
      const timePassed = currentTime - receivedOn; // in seconds

      const timeRemaining = secondsToExp - timePassed; // in seconds
      const expiration = expiresIn(timeRemaining);
      return expiration;
    }
    return null;
  }

  // TODO: these values need state from the Budget component
  // // incoming token values
  // const refreshToken = `TKN: ${tknVal.refresh_token}`;
  // const refreshTokenExpiresIn = `EXP: ${expiresIn(
  //   tknVal.refresh_token_expires_in
  // )}`;
  // const refreshTokenWillRefreshIn = `RFSH IN: ${refreshingIn(
  //   tknVal.refresh_token_expires_in,
  //   tknVal.createdOn,
  //   isLoading
  // )}`;
  // const accessToken = `TKN: ${tknVal.access_token}`;
  // const accessTokenExpiresIn = `EXP: ${expiresIn(tknVal.expires_in)}`;
  // const accessTokenWillRefreshIn = `RFSH IN: ${refreshingIn(
  //   tknVal.expires_in,
  //   tknVal.createdOn,
  //   isLoading
  // )}`;

  return dataValues;
}

export default {
  getAccessTokens,
  tknDataValues,
};
