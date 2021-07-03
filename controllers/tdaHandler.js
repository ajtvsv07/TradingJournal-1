const express = require("express");
const Joi = require("joi");
const axios = require("axios");

const getManagementApi = require("../utils/getManagementApi");
const TdAccessCred = require("../models/tdAccessCred");
const hashPayload = require("../utils/hashPayload");

const redirectUri = process.env.TDA_REDIRECT_URI;
const clientId = process.env.TDA_CONSUMER_KEY;

const updateManagementApi = require("../utils/updateManagementApi");

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

  // Connect TD Ameritrade Account: save access tokens to database and update isTdaLinked status
  updateAccStatusTokens: (req, res, next) => {
    // object error helper
    const sendErrorToClient = (err) => {
      res.send({
        success: false,
        message: err,
      });
    };

    // validate incoming payload
    const { error, value } = schema.validate(req.body);

    // handle validation error
    if (error) {
      // console.log("Validation Error: ", error.details[0]);
      sendErrorToClient(error.details[0].message);
    } else if (value) {
      console.log("Logging validated req value: ", value);
      // salt and hash string and object values
      hashPayload(value).then((hashedPayload) => {
        // create new model
        const tdAccessCreds = new TdAccessCred({
          _id: value.userId, // use the unhashed userId as unique db id.
          tdAuthCode: hashedPayload.tdAuthCode,
          tdTokens: hashedPayload.tdTokens,
        });

        // mongodb save method
        tdAccessCreds.save(function (error, savedTokens) {
          if (savedTokens) {
            // get token to communicate with management api
            getManagementApi()
              .then((response) => {
                const userId = savedTokens._id;
                const apiToken = response.data;
                const linked = true;

                // update management API account link status
                updateManagementApi(userId, apiToken, linked)
                  .then((result) => {
                    // send results to the client
                    res.send({
                      success: true,
                      message: "Your account has been successfully linked!",
                    });
                  })
                  .catch((error) => {
                    sendErrorToClient(`Request error ${error}`);
                  });
              })
              .catch((error) => {
                sendErrorToClient(`API token error ${error}`);
              });
          } else {
            sendErrorToClient(
              `There was a problem in saving the tokens ${error}`
            );
          }
        });
      });
    }
  },

  // delete all account data from db, update isTdaLinked status
  disconnectAccount: (req, res, next) => {
    const userId = req.body.data.user;

    // object error helper
    const sendErrorToClient = (err) => {
      res.send({
        success: false,
        message: err,
      });
    };

    const deleteAccessCreds = new Promise((resolve, reject) => {
      TdAccessCred.findByIdAndDelete(userId, (err, userDeleted) => {
        if (userDeleted) {
          resolve(`Deleted user creds successfully`);
        } else {
          reject("No TD Ameritrade connection found");
        }
      });
    });

    // delete user's post access token credentials
    deleteAccessCreds
      .then((resolved) => {
        console.log("Deleted Credentials: ", resolved);

        // get token to communicate with management api
        getManagementApi()
          .then((response) => {
            const apiToken = response.data;
            const linked = false;

            // update management API account link status
            updateManagementApi(userId, apiToken, linked)
              .then((result) => {
                // send results to the client
                res.send({
                  success: true,
                  data: result,
                  message: "Your account has been disconnected",
                });
              })
              .catch((error) => {
                sendErrorToClient(`Request error ${error}`);
              });
          })
          .catch((error) => {
            sendErrorToClient(`API token error ${error}`);
          });
      })
      .catch((error) => {
        sendErrorToClient(
          `There was a problem in deleting the tokens ${error}`
        );
      });
  },
};
