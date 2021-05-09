import { useEffect, useState } from "react";
import axios from "axios";

function useGetAuthLinkDetails(auth0ClientToken) {

  const [linkDetails, setLinkDetails] = useState("");
  const [linkStatus, setLinkStatus] = useState("fetching");

  useEffect(() => {
      auth0ClientToken.then((token) => {
        // cancel if they're not logged in
        if (!token) return;
        const fetchApi = async () => {
          try {
            const res = await axios.get(
              `${process.env.REACT_APP_EXPRESS_API}/tda/tdaUserAuthLink`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setLinkDetails(res.data.payload);
            setLinkStatus("fetched");
          } catch (error) {
            setLinkStatus(error);
          }
        };

        fetchApi();
      });

  }, []);

  return { linkDetails, linkStatus };
}

export default useGetAuthLinkDetails;
