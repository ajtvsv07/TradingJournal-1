const redirectUri = process.env.TDA_REDIRECT_URI;
const clientId = process.env.TDA_CLIENT_ID;

// send auth link details to client
// used to build url
const tdUrlDetails = (req, res, next) => {
  res.send({
    success: true,
    message: "Auth link details provided",
    payload: {
      redirectUri: redirectUri,
      clientId: clientId,
    },
  });
};

module.exports = tdUrlDetails;
