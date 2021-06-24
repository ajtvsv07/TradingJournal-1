import axios from "axios";
import { useQuery } from "react-query";

function getAuthLinkDetails(clientToken) {
  const { clientAccessToken } = clientToken;

  const fetchDetails = async () => {
    const res = await axios
      .get(`${process.env.REACT_APP_EXPRESS_API}/tda/tdaUserAuthLinkDetails`, {
        headers: { Authorization: `Bearer ${clientAccessToken}` },
      })
      .catch((error) => {
        throw new Error("Unable to generate tokens:", error.message);
      });

    return res;
  };

  return useQuery("getAuthLinkDetails", () => fetchDetails(), {
    // The query will not execute until clientAccessToken exists
    enabled: !!clientAccessToken,
  });
}

export default getAuthLinkDetails;
