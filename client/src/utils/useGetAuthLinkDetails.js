import { useEffect, useState, useRef } from "react";
import axios from "axios";

function useGetAuthLinkDetails(clientToken) {
  const [authLinkDetails, setAuthLinkDetails] = useState({
    linkDetails: null,
    status: "fetching",
  });
  const cache = useRef({});
  
  useEffect(() => {
    const setAuthDetails = async () => {
      const { clientAccessToken } = clientToken;
      const res = await axios.get(
        `${process.env.REACT_APP_EXPRESS_API}/tda/tdaUserAuthLink`,
        {
          headers: { Authorization: `Bearer ${clientAccessToken}` },
        }
      );
      cache.current.authDetails = res.data.payload; // set response in cache;
      setAuthLinkDetails({
        linkDetails: res,
        status: "fetched",
      });
    };

    if (clientToken.status === "fetched") {
      if (cache.current.authDetails) {
        const token = cache.current.authDetails;
        setAuthLinkDetails({
          linkDetails: token,
          status: "fetched",
        });
      } else {
        setAuthDetails();
      }
    }
  }, [clientToken.status]);

  return authLinkDetails;
}

export default useGetAuthLinkDetails;
