import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "react-query";

function getAccessToken() {
  const { getAccessTokenSilently, isLoading } = useAuth0();

  const returnTokens = async () => {
    if (!isLoading) {
      return getAccessTokenSilently();
    }
    throw new Error("Couldn't get access tokens silently");
  };

  return useQuery("getAuthLinkDetails", () => returnTokens());
}

export default getAccessToken;
