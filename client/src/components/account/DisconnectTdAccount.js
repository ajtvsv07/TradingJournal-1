import axios from "axios";

export default function disconnectTdAccount(user, clientToken) {
  const { clientAccessToken, clientTokenStatus } = clientToken;
  const userId = user.sub;

  return new Promise((resolve, reject) => {
    const runDisconnect = async () => {
      // call server
      const res = await axios
        .post(
          `${process.env.REACT_APP_EXPRESS_API}/tda/disconnectAccount`,
          {
            data: {
              user: userId,
            },
          },
          {
            headers: { Authorization: `Bearer ${clientAccessToken}` },
          }
        )
        .catch((error) => {
          // handled by react-error-boundary
          // eslint-disable-next-line prefer-promise-reject-errors
          reject("There was an error with the request: ", error.message);
        });

      resolve(res.data);
    };

    // ensure tokens are valid to make request
    if (clientTokenStatus === "fetched") {
      runDisconnect();
    } else {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject("Valid client tokens not found. Please try again later");
    }
  });
}
