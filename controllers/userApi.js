const express = require("express");
const Joi = require("joi");
const router = express.Router();
const axios = require("axios");
const getManagementApi = require("../utils/getManagementApi");

// sample joi schema
const schema = Joi.object({
  // TODO: create joi schema
})
  
  router.post("/updateUserDetails", (req, res, next) => {
  // TODO: validate  incoming request
  const valid = schema.validate(req.body.data);
  getManagementApi()
    .then((response) => {
      const payload = req.body.data;
      const token = response.data;
      // console.log("Req payload: ", payload);
      // console.log("Token: ", token);

      // update auth0 name and username (treated as same)
      return (
        new Promise((resolve, reject) => {
          axios({
            method: "PATCH",
            url: `${process.env.MANAGEMENT_API_AUDIENCE}users/${payload.id}`,
            headers: {
              authorization: `${token.token_type} ${token.access_token}`,
              "content-type": "application/json",
            },
            data: {
              username: payload.username,
              name: payload.username,
            },
          })
            .then((resolved) => {
              resolve(resolved.data);
            })
            .catch((error) => {
              console.log("Update details error: ", error);
              reject(new Error("User update error: ", error));
            });
        })
          // update auth0 user_metadata and email
          .then((previousResult) => {
            return new Promise((resolve, reject) => {
              axios({
                method: "PATCH",
                url: `${process.env.MANAGEMENT_API_AUDIENCE}users/${payload.id}`,
                headers: {
                  authorization: `${token.token_type} ${token.access_token}`,
                  "content-type": "application/json",
                },
                data: {
                  email: payload.email,
                  user_metadata: {
                    emailVerificationSent: payload.newEmail,
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                  },
                },
              })
                .then((resolved) => {
                  resolve({ ...previousResult, ...resolved.data });
                })
                .catch((error) => {
                  console.log("Update details error: ", error);
                  reject(new Error("Update details error: ", error));
                });
            });
          })
          // if user changes their email, send verification email to the new address
          .then((previousResult) => {
            if (payload.newEmail) {
              return new Promise((resolve, reject) => {
                axios({
                  method: "POST",
                  url: `${process.env.MANAGEMENT_API_AUDIENCE}jobs/verification-email`,
                  headers: {
                    authorization: `${token.token_type} ${token.access_token}`,
                    "content-type": "application/json",
                  },
                  data: {
                    user_id: payload.id,
                  },
                })
                  .then((resolved) => {
                    resolve({ ...previousResult, ...resolved.data });
                  })
                  .catch((error) => {
                    console.log("Update details error: ", error);
                    reject(new Error("Email verification error: ", error));
                  });
              });
            } else {
              return previousResult;
            }
          })
          // if all succeeds, send confirmation
          .then(function (user) {
            res.json({
              success: true,
              message: "Success, your user details have been updated.",
              username: user.username,
              email: user.email,
              metadata: user.user_metadata,
            });
          })
      );
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "There was an error with the promise requests",
        error: error,
      });
    });
});

module.exports = router;
