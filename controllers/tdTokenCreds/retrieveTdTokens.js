const TdAccessCred = require("../../models/tdAccessCred");
const sendErrorToClient = require("../../utils/sendErrorToClient");
const decryptPayload = require("../../utils/hashEncrypt/decryptPayload");

// retrieve td tokens and their expiration
const retrieveTdTokens = async (req, res, next) => {
  const userId = req.body.userId;
  const tokens = await TdAccessCred.findById(userId, "tdTokens").exec();

  if (tokens.tdTokens) {
    // decrypt tokens
    decryptPayload(tokens.tdTokens).then((decryptedPayload) => {
      res.send({
        success: true,
        tokens: decryptedPayload,
        message: "Successfully retrieved tokens.",
      });
    });
  } else {
    sendErrorToClient(res, "No Document found!");
  }
};

module.exports = retrieveTdTokens;
