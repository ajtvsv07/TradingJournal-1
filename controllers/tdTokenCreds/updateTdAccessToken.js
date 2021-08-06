const Joi = require("joi");

const encryptPayload = require("../../utils/hashEncrypt/encryptPayload");
const sendErrorToClient = require("../../utils/sendErrorToClient");
const TdAccessCred = require("../../models/tdAccessCred");

const schema = Joi.object({
  newAccssTkn: Joi.string().required(),
  userId: Joi.string().required(),
});

const table = "Table";

const updateTdAccessToken = (req, res, next) => {
  // 1: Validate
  const { error, value } = schema.validate(req.body);
  if (error) {
    // console.log("Validation Error: ", error.details[0]);
    sendErrorToClient(res, error.details[0].message);
  } else if (value) {
    console.log("Incoming value to be encrypted: ", value);
    // TODO: update reformated values so these queries can work
    encryptPayload(value).then(async (encryptedPayload) => {
      console.log("Encrypted Payload: ", encryptedPayload);
      // find and update
      const userId = req.body.userId;
      const tokenCreds = await TdAccessCred.findById(userId, "encryptedTokens");
      tokenCreds.projection({ tdTokens: {} });

      if (tokens) {
        // 3: Save to database

        if (savedTokens) {
          // get token to communicate with management api
          getManagementApi()
            .then((response) => {
              const userId = savedTokens._id;
              const apiToken = response.data;
              const linked = true;

              // 4: Update status
              updateManagementApi(userId, apiToken, linked)
                .then((result) => {
                  // 5: respond to client
                  res.send({
                    success: true,
                    message: "Your account has been successfully linked!",
                  });
                })
                .catch((error) => {
                  sendErrorToClient(res, `Request error ${error}`);
                });
            })
            .catch((error) => {
              sendErrorToClient(res, `API token error ${error}`);
            });
        } else {
          sendErrorToClient(
            res,
            `There was a problem in saving the tokens ${error}`
          );
        }
      } else {
        sendErrorToClient(res, "Couldn't find existing token");
      }
    });
  }
};

module.exports = updateTdAccessToken;
