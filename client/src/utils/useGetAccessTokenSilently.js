import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "react-query";

function getAccessToken() {
  const { getAccessTokenSilently } = useAuth0();

  return useQuery("getAuthLinkDetails", () => getAccessTokenSilently());
}

export default getAccessToken;
