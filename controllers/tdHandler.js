const express = require("express");
const Joi = require("joi");
const axios = require("axios");

const getManagementApi = require("../utils/getManagementApi");
const TdAccessCred = require("../models/tdAccessCred");
const hashPayload = require("../utils/hashEncrypt/hashPayload");
const encryptPayload = require("../utils/hashEncrypt/encryptPayload");

const redirectUri = process.env.TDA_REDIRECT_URI;
const clientId = process.env.TDA_CLIENT_ID;

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
    })
    .required(),
  tdAuthCode: Joi.string().required(),
  userId: Joi.string().max(45).required(),
});

module.exports = {
  // send auth link details to client
  // used to build url
  tdUrlDetails: (req, res, next) => {
    res.send({
      success: true,
      message: "Auth link details provided",
      payload: {
        redirectUri: redirectUri,
        clientId: clientId,
      },
    });
  },

  // Connect TD Ameritrade Account: save access tokens to database and update isTdaLinked status
  // 1: Validate
  // 2: Hash
  // 3: Save to database
  // 4: Update status
  // 5: respond to client
  connectAccount: (req, res, next) => {
    // 1
    const { error, value } = schema.validate(req.body);

    // handle validation error
    if (error) {
      // console.log("Validation Error: ", error.details[0]);
      sendErrorToClient(res, error.details[0].message);
    } else if (value) {
      // 2
      encryptPayload(value).then((hashedPayload) => {
        // create new model
        const tdAccessCreds = new TdAccessCred({
          _id: value.userId, // use the unhashed userId as unique db id.
          tdAuthCode: hashedPayload.tdAuthCode,
          tdTokens: hashedPayload.tdTokens,
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
  },

  // delete all account data from db, update isTdaLinked status
  // 1: Find and delete user creds from database
  // 2: Update status
  // 3: respond to client
  disconnectAccount: (req, res, next) => {
    const userId = req.body.data.user;

    const deleteAccessCreds = new Promise((resolve, reject) => {
      TdAccessCred.findByIdAndDelete(userId, (err, userDeleted) => {
        if (userDeleted) {
          resolve(`Deleted user creds successfully`);
        } else {
          reject("No existing TD Ameritrade connection found");
        }
      });
    });

    // 1
    deleteAccessCreds
      .then((resolved) => {
        // get token to communicate with management api
        getManagementApi()
          .then((response) => {
            const apiToken = response.data;
            const linked = false;

            // 2
            updateManagementApi(userId, apiToken, linked)
              .then((result) => {
                // 3
                res.send({
                  success: true,
                  message: "Your account has been disconnected",
                });
              })
              .catch((error) => {
                sendErrorToClient(res, `Request error. ${error}`);
              });
          })
          .catch((error) => {
            sendErrorToClient(res, `API token error. ${error}`);
          });
      })
      .catch((error) => {
        sendErrorToClient(
          res,
          `There was a problem in deleting the tokens. ${error}`
        );
      });
  },
};
