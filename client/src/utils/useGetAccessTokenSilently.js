import { useEffect, useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";

function useGetAccessTokenSilently() {
  const [clientToken, setClientToken] = useState({
    clientAccessToken: null,
    status: "fetching",
  });
  const cache = useRef({});
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const setToken = () => {
      getAccessTokenSilently().then((token) => {
        cache.current.clientToken = token; // set response in cache;
        setClientToken({
          clientAccessToken: token,
          status: "fetched",
        });
      });
    };

    if (cache.current.clientToken) {
      const token = cache.current.clientToken;
      setClientToken({
        clientAccessToken: token,
        status: "fetched",
      });
    } else {
      setToken();
    }
  }, []);

  // console.log("Client access token: ", clientAccessToken);
  return {clientToken};
}

export default useGetAccessTokenSilently;
