import axios from "axios";
import { useQuery } from "react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { useErrorHandler } from "react-error-boundary";

function saveTokens(tdTokens, tdTokensError, clientToken, tdAuthCode) {
  const handleError = useErrorHandler();
  const { user, isAuthenticated } = useAuth0();

  if (!tdTokensError) {
    const saveTdTokens = async () => {
      if (isAuthenticated) {
        const { data } = await axios
          .post(
            `${process.env.REACT_APP_EXPRESS_API}/tda/updateAccStatusTokens`,
            {
              tdTokens,
              tdAuthCode,
              userId: user.sub,
            },
            {
              headers: { Authorization: `Bearer ${clientToken}` },
            }
          )
          // TODO: errors not displayin through react-error-boundary
          .catch((error) => {
            throw new Error("Save tokens request error: ", error);
          });

        // handle specific errors (eventhough req 200) with react-error-boundary
        if (!data.success) {
          handleError(data.message);
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

  throw new Error("Error: Could not save tokens");
}

export default saveTokens;
