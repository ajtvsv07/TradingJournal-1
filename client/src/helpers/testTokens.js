import axios from "axios";
import {
  expiresIn,
  refreshingIn,
  getNewAccessToken,
  getNewRefreshToken,
  saveNewTokens,
} from "./calculateTokenExp";

export default async function testTokens(
  user,
  getAccessTokenSilently,
  linkDetails,
  linkDetailsLoading,
  linkDetailsError
) {
  const { redirectUri, clientId } = linkDetails.payload;
  const clientAccessToken = await getAccessTokenSilently();

  // get tokens
  const { data } = await axios.post(
    `${process.env.REACT_APP_EXPRESS_API}/tda/tdAccessTokens`,
    {
      userId: user.sub,
    },
    {
      headers: { Authorization: `Bearer ${clientAccessToken}` },
    }
  );

  if (!data.success) {
    throw new Error("Unable to get tokens:", data.message);
  }

  // incoming token values
  const accssTkn = data.tokens.access_token;
  const accssTknExpIn = expiresIn(data.tokens.expires_in);
  const {
    timeRemaining: accessTokenTimeLeft,
    refreshesIn: accssTknWillRefreshIn,
  } = refreshingIn(data.tokens.expires_in, data.tokens.createdOn);
  const rfTkn = data.tokens.refresh_token;
  const rfTknExpIn = expiresIn(data.tokens.refresh_token_expires_in);
  const {
    timeRemaining: refreshTokenTimeLeft,
    refreshesIn: rfTknWillRefreshIn,
  } = refreshingIn(data.tokens.refresh_token_expires_in, data.tokens.createdOn);

  // verify tokens
  // if access token expired - update it

  if (accessTokenTimeLeft <= 0 && !linkDetailsLoading && !linkDetailsError) {
    const newAccssTkn = getNewAccessToken(clientId, rfTkn);
    const { tokensSaved } = saveNewTokens(newAccssTkn, user, clientAccessToken);
    // return updated access token
    if (tokensSaved.success) {
      return {
        rfTkn,
        rfTknExpIn,
        rfTknWillRefreshIn,
        accssTkn: newAccssTkn,
        accssTknExpIn,
        accssTknWillRefreshIn,
      };
    }
    throw new Error("There was a problem in saving the new udpated token");
  }

  // if refresh token expired - request new one
  else if (
    refreshTokenTimeLeft <= 0 &&
    !linkDetailsLoading &&
    !linkDetailsError
  ) {
    // TODO: check if redirectUri needs to be passed
    // TODO: develop getNewRefreshToken method - NOT READY
    const newRfTkn = getNewRefreshToken(redirectUri, clientId);
    const { tokensSaved } = saveNewTokens(newRfTkn, user, clientAccessToken);
    // return updated refresh token
    if (tokensSaved.success) {
      return {
        rfTkn: newRfTkn,
        rfTknExpIn,
        rfTknWillRefreshIn,
        accssTkn,
        accssTknExpIn,
        accssTknWillRefreshIn,
      };
    }
  }

  // else all tokens are still valid - return them
  return {
    rfTkn,
    rfTknExpIn,
    rfTknWillRefreshIn,
    accssTkn,
    accssTknExpIn,
    accssTknWillRefreshIn,
  };
}
