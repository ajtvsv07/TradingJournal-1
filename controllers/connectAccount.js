const Joi = require("joi");

const getManagementApi = require("../utils/getManagementApi");
const TdAccessCred = require("../models/tdAccessCred");
const encryptPayload = require("../utils/hashEncrypt/encryptPayload");

const updateManagementApi = require("../utils/updateManagementApi");
const sendErrorToClient = require("../utils/sendErrorToClient");

// joi schema validation
const schema = Joi.object({
  tdTokens: Joi.object()
    .keys({
      access_token: Joi.string(),
      refresh_token: Joi.string(),
      token_type: Joi.string(),
      expires_in: Joi.number(),
      scope: Joi.string(),
      refresh_token_expires_in: Joi.number(),
      createdOn: Joi.number(),
    })
    .required(),
  tdAuthCode: Joi.string().required(),
  userId: Joi.string().max(45).required(),
});

// connect TD Ameritrade Account: save access tokens to database and update isTdaLinked status
// 1: Validate
// 2: Hash
// 3: Save to database
// 4: Update status
// 5: respond to client
const connectAccount = (req, res, next) => {
  // 1
  const { error, value } = schema.validate(req.body);

  // handle validation error
  if (error) {
    // console.log("Validation Error: ", error.details[0]);
    sendErrorToClient(res, error.details[0].message);
  } else if (value) {
    // 2
    encryptPayload(value).then((encryptedPayload) => {
      // create new model
      const tdAccessCreds = new TdAccessCred({
        _id: value.userId, // use the unhashed userId as unique db id.
        encryptedTokens: encryptedPayload,
      });

      // 3
      tdAccessCreds.save(function (error, savedTokens) {
        if (savedTokens) {
          // get token to communicate with management api
          getManagementApi()
            .then((response) => {
              const userId = savedTokens._id;
              const apiToken = response.data;
              const linked = true;

              // 4
              updateManagementApi(userId, apiToken, linked)
                .then((result) => {
                  // 5
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
      });
    });
  }
};

module.exports = connectAccount;
