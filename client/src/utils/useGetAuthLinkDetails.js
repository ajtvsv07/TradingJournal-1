import axios from "axios";
import { useQuery } from "react-query";

function getAuthLinkDetails(clientToken) {
  // returns fetch promise
  const fetchDetails = async () => {
    const { data } = await axios
      .get(`${process.env.REACT_APP_EXPRESS_API}/tda/tdaUserAuthLinkDetails`, {
        headers: { Authorization: `Bearer ${clientToken}` },
      })
      .catch((error) => {
        throw new Error("Unable to generate tokens:", error.message);
      });

    return data;
  };

  return useQuery("authLinkDetails", () => fetchDetails(), {
    // The query will not execute until clientToken exists
    enabled: !!clientToken,
  });
}

export default getAuthLinkDetails;
