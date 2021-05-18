const express = require("express");
const Joi = require("joi");
const router = express.Router();
const getManagementApi = require("../utils/getManagementApi");

const redirectUri = process.env.TDA_REDIRECT_URI;
const clientId = process.env.TDA_CONSUMER_KEY;

const incomingRequestSample = {
  data: {
    access_token: "access_token",
    refresh_token: "refresh_token",
    token_type: "someTokenType",
    expires_in: 2300,
    scope: "some_scope another_scope",
    refresh_token_expires_in: 2300,
  },
  userId: "auth0|60878da62b1a650070b91557",
};

// sample joi schema
const schema = Joi.object({
  data: Joi.object({
    access_token: Joi.string(),
    refresh_token: Joi.string(),
    token_type: Joi.string(),
    expires_in: Joi.number(),
    scope: Joi.string(),
    refresh_token_expires_in: Joi.number(),
  }),
  userId: Joi.string().max(45).required(),
});

// send auth link details to client
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
  console.log("Incoming request", JSON.stringify(req.body));

  const { error, value } = schema.validate(JSON.stringify(req.body));

  if (error) {
    console.log("Error on the back end: ", error.details[0]);
    // handle errors - send to client
    res.send({
      success: false,
      message: error.details[0].message,
      payload: req.body.data,
    });
  } else if (value) {
    console.log(value);
  }

  // validate and sanitize incoming payload
  // hash/encrypt payload
  // save to database
  // make request to management API to update account linked status
  // if everything successful, return back success message, otherwise, return error

  // respond with success message
  // res.send({
  //   success: true,
  //   message:
  //     "Tokens were securely saved, and your TD Ameritrade account has now been linked!",
  //   payload: req.body.data,
  // });

  // respond with error message
  // res.status(500).send({
  //   success: false,
  //   message: "There was a problem with the server. Redirecting you back to your account settings. Please try again tomorrow",
  //   error: error
  // });
});

// router.post("/linkTdaAccount", (req, res, next) => {
//   console.log("Incoming request", req.body.data);
//   res.send({
//     success: true,
//     message: "Message recieved",
//     data: req.body.data,
//   });
// getManagementApi()
//   .then((response) => {
//     const payload = req.body.data;
//     const token = response.data;

//     return new Promise((resolve, reject) => {
//       axios({
//         method: "PATCH",
//         url: `${process.env.MANAGEMENT_API_AUDIENCE}users/${payload.id}`,
//         headers: {
//           authorization: `${token.token_type} ${token.access_token}`,
//           "content-type": "application/json",
//         },
//         data: {
//           user_metadata: {
//             preferences: {
//               isTdaLinked: payload.linkAccount,
//             },
//           },
//         },
//       })
//         .then((resolved) => {
//           resolve(resolved.data);
//         })
//         .catch((error) => {
//           console.log("Update details error: ", error);
//           reject(new Error("User update error: ", error));
//         });
//     });
//   })
// });

module.exports = router;
