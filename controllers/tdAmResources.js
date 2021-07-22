const crypto = require("crypto");

const TdAccessCred = require("../models/tdAccessCred");
const sendErrorToClient = require("../utils/sendErrorToClient");

module.exports = {
  // retrieve td tokens and their expiration
  retrieveTdTokens: async (req, res, next) => {
    const userId = req.body.userId;
    const tokens = await TdAccessCred.findById(userId, "tdTokens").exec();

    // decrypt tokens
    bcrypt.compare(myPlaintextPassword, tokens, function (err, result) {
      // result == true
    });

    if (tokens.err) {
      console.log(err);
      res.send({
        success: false,
        message: `There was an error in retrieving the user's tokens: ${err}`,
      });
    }

    res.send({
      success: true,
      data: tokens,
      message: "Successfully retrieved tokens.",
    });
  },
};
