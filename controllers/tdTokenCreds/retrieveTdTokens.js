const TdAccessCred = require("../../models/tdAccessCred");
const sendErrorToClient = require("../../utils/sendErrorToClient");
const decryptPayload = require("../../utils/hashEncrypt/decryptPayload");

// retrieve td tokens and their expiration
const retrieveTdTokens = async (req, res, next) => {
  const userId = req.body.userId;
  const tokens = await TdAccessCred.findById(userId, "encryptedTokens").exec();

  if (tokens) {
    // decrypt tokens
    decryptPayload(tokens).then((decryptedPayload) => {
      res.send({
        success: true,
        data: decryptedPayload,
        message: "Successfully retrieved tokens.",
      });
    });
  } else {
    sendErrorToClient(res, "No Document found!");
  }
};

module.exports = retrieveTdTokens;
