import axios from "axios";
import { useQuery } from "react-query";

function getAuthLinkDetails(clientToken, clientTokenError) {
  if (!clientTokenError) {
    const fetchDetails = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_EXPRESS_API}/tda/tdaUserAuthLinkDetails`,
        {
          headers: { Authorization: `Bearer ${clientToken}` },
        }
      );

      if (data.error) {
        throw new Error("Unable to generate tokens:", data.error.message);
      }

      return data;
    };

    return useQuery("authLinkDetails", () => fetchDetails(), {
      // The query will not execute until clientToken exists
      enabled: !!clientToken,
    });
  }

  throw new Error("Could not get authlink details");
}

export default getAuthLinkDetails;
