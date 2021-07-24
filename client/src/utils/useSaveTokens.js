import axios from "axios";
import { useQuery } from "react-query";
import { useAuth0 } from "@auth0/auth0-react";

function saveTokens(tdTokens, tdTokensLoading, tdTokensError, tdAuthCode) {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const saveTdTokens = async () => {
    if (tdTokens && !tdTokensLoading && !tdTokensError && isAuthenticated) {
      const getClientToken = await getAccessTokenSilently();
      const { data } = await axios
        .post(
          `${process.env.REACT_APP_EXPRESS_API}/tda/connectAccount`,
          {
            tdTokens,
            tdAuthCode,
            userId: user.sub,
          },
          {
            headers: { Authorization: `Bearer ${getClientToken}` },
          }
        )
        .catch((error) => {
          throw new Error("Save tokens request error: ", error);
        });

      // handle specific errors (eventhough req 200) with react-error-boundary
      if (!data.success) {
        console.log("Incoming error: ", data);
        return new Error(
          "You may be trying to connect an account that already exists or have encountered a connection issue."
        );
      }

      return data;
    }
    throw new Error(
      "You are not authenticated to save these tokens. Please login and try again."
    );
  };

  return useQuery("saveTdTokens", () => saveTdTokens(), {
    // The query will not execute until clientToken exists
    enabled: !!tdTokens,
  });
}

export default saveTokens;
