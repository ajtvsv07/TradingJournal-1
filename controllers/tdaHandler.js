const express = require("express");
const Joi = require("joi");
const axios = require("axios");

const getManagementApi = require("../utils/getManagementApi");
const TdAccessCred = require("../models/tdAccessCred");
const hashPayload = require("../utils/hashPayload");

const redirectUri = process.env.TDA_REDIRECT_URI;
const clientId = process.env.TDA_CONSUMER_KEY;

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
    })
    .required(),
  tdAuthCode: Joi.string().required(),
  userId: Joi.string().max(45).required(),
});

module.exports = {
  // send auth link details to client
  tdaUserAuthLinkDetails: (req, res, next) => {
    res.send({
      success: true,
      message: "Auth link details provided",
      payload: {
        redirectUri: redirectUri,
        clientId: clientId,
      },
    });
  },

  // Connect TD Ameritrade Account: save tda tokens to database and update isTdaLinked status
  updateAccStatusTokens: (req, res, next) => {
    // single error handler to reply to client (Client handling with react-error-boundary)
    const topScopeErrorHandler = (specificError) => {
      res.send({
        success: false,
        message: specificError,
        payload: req.body,
      });
    };
    // validate incoming payload
    const { error, value } = schema.validate(req.body);
    // handle validation error - send to client
    if (error) {
      // console.log("Validation Error: ", error.details[0]);
      topScopeErrorHandler(error.details[0].message);
    } else if (value) {
      // salt and hash string and object values
      hashPayload(value).then((hashedPayload) => {
        // create new model
        const tdAccessCreds = new TdAccessCred({
          _id: value.userId, // use the unhashed userId as unique db id.
          tdAuthCode: hashedPayload.tdAuthCode,
          tdTokens: hashedPayload.tdTokens,
        });
        // mongodb save method
        tdAccessCreds.save(function (err, creds) {
          if (creds) {
            // call management API to get token, to then use in connecting with Auth0 and updating the isTdaLinked status
            getManagementApi().then((response, mngErr) => {
              if (mngErr) {
                topScopeErrorHandler(mngErr);
              }
              const token = response.data;
              const updateManagementApi = () => {
                return new Promise((resolve, reject) => {
                  axios({
                    method: "PATCH",
                    url: `${process.env.MANAGEMENT_API_AUDIENCE}users/${creds._id}`,
                    headers: {
                      authorization: `${token.token_type} ${token.access_token}`,
                      "content-type": "application/json",
                    },
                    data: {
                      user_metadata: {
                        preferences: {
                          isTdaLinked: true,
                        },
                      },
                    },
                  })
                    .then((result) => {
                      resolve(result.data);
                    })
                    .catch((error) => {
                      console.log(
                        "Error in updating isTdaLinked status: ",
                        error
                      );
                      reject(new Error("isTdaLinked status error: ", error));
                    });
                });
              };
              // update isTdaLinked status and send final confirmation to client
              updateManagementApi().then((result, err) => {
                // final success response to client
                // don't need to send the auth0 payload back to client
                // console.log("payload: ", result);
                result
                  ? res.send({
                      success: true,
                      message: "Your account has been successfully linked!",
                    })
                  : topScopeErrorHandler(err);
              });
            });
          } else {
            console.error(err);
            topScopeErrorHandler(err);
          }
        });
      });
    }
  },

  // delete all account data from db, update isTdaLinked status
  disconnectAccount: (req, res, next) => {
    console.log("Incoming data: ", req.body);

    // TODO: query database and delete information
    // TODO: update auth0 isTdaLinked status

    res.send({
      status: "success",
      data: null,
      message: "Successfully disconnected account!",
    });
  },
};
