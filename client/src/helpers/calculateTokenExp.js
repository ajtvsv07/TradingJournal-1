import axios from "axios";
import queryString from "query-string";

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
function refreshingIn(secondsToExp, timestamp) {
  const receivedOn = Math.floor(timestamp / 1000).toFixed(0); // convert from milliseconds to seconds
  const currentTime = (Date.now() / 1000).toFixed(0);
  const timePassed = currentTime - receivedOn; // in seconds

  const timeRemaining = secondsToExp - timePassed; // in seconds
  const refreshesIn = expiresIn(timeRemaining);
  return {
    timeRemaining,
    refreshesIn,
  };
}

async function getNewAccessToken(clientId, refreshToken) {
  console.log("Client ID: ", clientId);
  console.log("Refresh Token: ", refreshToken);
  const { data } = await axios
    .request({
      url: process.env.REACT_APP_TD_POST_ACCESS_TOKEN,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: queryString.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: `${clientId}@AMER.OAUTHAP`, // url decoded
      }),
    })
    .catch((error) => {
      console.log("Error with access token request: ", error);
      throw new Error("Unable to generate a new access token:", error.message);
    });

  console.log("New access token: ", data);

  return data;
}

async function getNewRefreshToken(clientId, refreshToken) {
  const { data } = await axios
    .request({
      url: process.env.REACT_APP_TD_POST_ACCESS_TOKEN,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: queryString.stringify({
        grant_type: "refresh_token",
        refresh_token: { refreshToken },
        client_id: `${clientId}@AMER.OAUTHAP`, // url decoded
      }),
    })
    .catch((error) => {
      console.log("Error with refresh token request: ", error);
      throw new Error("Unable to generate a new refresh token:", error.message);
    });

  return data;
}

async function saveNewTokens(newAccssTkn, user, clientAccessToken) {
  if (newAccssTkn) {
    const { data } = await axios
      .patch(
        `${process.env.REACT_APP_EXPRESS_API}/tda/updateAccessToken`,
        {
          newAccssTkn,
          userId: user.sub,
        },
        {
          headers: { Authorization: `Bearer ${clientAccessToken}` },
        }
      )
      .catch((error) => {
        throw new Error("Save tokens request error: ", error);
      });

    console.log("save new token result: ", data);

    return data;
  }

  throw new Error("Not able to save new token");
}

export {
  expiresIn,
  refreshingIn,
  getNewAccessToken,
  getNewRefreshToken,
  saveNewTokens,
};
