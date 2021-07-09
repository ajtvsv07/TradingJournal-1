import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "react-query";
import useGetAccessTokenSilently from "../../utils/useGetAccessTokenSilently";

export default function disconnectTdAccount() {
  const { user } = useAuth0();
  const { data: clientToken } = useGetAccessTokenSilently();
  const userId = user.sub;

  const runDisconnect = async () => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_EXPRESS_API}/tda/disconnectAccount`,
      {
        data: {
          user: userId,
        },
      },
      {
        headers: { Authorization: `Bearer ${clientToken}` },
      }
    );

    if (data.error) {
      throw new Error(
        "There was an errror in disconnecting from server: ",
        data.error.message
      );
    }

    return data;
  };

  return useQuery("runDisconnect", () => runDisconnect(), {
    // The query will not execute until clientToken exists
    enabled: !!clientToken,
  });
}
