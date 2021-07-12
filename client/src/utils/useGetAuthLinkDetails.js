import axios from "axios";
import { useQuery } from "react-query";
import { useAuth0 } from "@auth0/auth0-react";

function getAuthLinkDetails() {
  const { getAccessTokenSilently } = useAuth0();

  const getDetails = async () => {
    const getClientToken = await getAccessTokenSilently();

    const { data } = await axios.get(
      `${process.env.REACT_APP_EXPRESS_API}/tda/tdaUserAuthLinkDetails`,
      {
        headers: { Authorization: `Bearer ${getClientToken}` },
      }
    );

    if (data.error) {
      throw new Error("Unable to generate tokens:", data.error.message);
    }

    return data;
  };

  return useQuery("authLinkDetails", () => getDetails(), {
    enabled: !!getAccessTokenSilently,
  });
}

export default getAuthLinkDetails;
