import { useEffect, useState, useRef } from "react";
import axios from "axios";

function getAuthLinkDetails(clientToken) {
  const [authLinkDetails, setAuthLinkDetails] = useState({
    linkDetails: null,
    authLinkStatus: "fetching",
  });
  const cache = useRef({});
  const { clientAccessToken, clientTokenStatus } = clientToken;

  useEffect(() => {
    const setAuthDetails = async () => {
      const res = await axios
        .get(
          `${process.env.REACT_APP_EXPRESS_API}/tda/tdaUserAuthLinkDetails`,
          {
            headers: { Authorization: `Bearer ${clientAccessToken}` },
          }
        )
        .catch((error) => {
          throw new Error("Unable to generate tokens:", error.message);
        });

      // cache resonse
      cache.current.authDetails = res.data.payload;
      // udpate State
      setAuthLinkDetails({
        linkDetails: res,
        authLinkStatus: "fetched",
      });
    };

    if (clientTokenStatus === "fetched") {
      if (cache.current.authDetails) {
        const token = cache.current.authDetails;
        setAuthLinkDetails({
          linkDetails: token,
          authLinkStatus: "fetched",
        });
      } else {
        setAuthDetails();
      }
    }
  }, [clientTokenStatus]);

  return authLinkDetails;
}

export default getAuthLinkDetails;
