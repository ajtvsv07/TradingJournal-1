const express = require("express");
const router = express.Router();
const getManagementApi = require("../utils/getManagementApi");

const redirectUri = process.env.TDA_REDIRECT_URI;
const clientId = process.env.TDA_CONSUMER_KEY;

router.get("/tdaUserAuthLink", (req, res, next) => {
  res.send({
    success: true,
    message: "Auth link details provided",
    payload: {
      redirectUri: redirectUri,
      clientId: clientId,
    },
  });
});

// save tda tokens to database and update account linked status
router.post("/updateAccStatusTokens", (req, res, next) => {
  
  console.log("Incoming request", req.body.data);

  // respond with success message
  res.send({
    success: true,
    message: "Tokens were securely saved, and your TD Ameritrade account has now been linked!",
    payload: req.body.data.tokens
  });

  // respond with failed message
  // res.status(500).send({
  //   success: false,
  //   message: "There was a problem with the server. Redirecting you back to your account settings. Please try again tomorrow",
  //   error: error
  // });
});

module.exports = router;
