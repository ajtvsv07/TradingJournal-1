const TdAccessCred = require("../models/tdAccessCred");
const sendErrorToClient = require("../utils/sendErrorToClient");
const decryptPayload = require("../utils/hashEncrypt/decryptPayload");

module.exports = {
  // retrieve td tokens and their expiration
  retrieveTdTokens: async (req, res, next) => {
    const userId = req.body.userId;
    const tokens = await TdAccessCred.findById(
      userId,
      "encryptedTokens"
    ).exec();

    if (tokens.err) {
      console.log(err);
      res.send({
        success: false,
        message: `There was an error in retrieving the user's tokens: ${err}`,
      });
    }

    // decrypt tokens
    decryptPayload(tokens).then((decryptedPayload) => {
      console.log("Decrypted Payload: ", decryptedPayload);

      res.send({
        success: true,
        data: decryptedPayload,
        message: "Successfully retrieved tokens.",
      });
    });
  },
};
