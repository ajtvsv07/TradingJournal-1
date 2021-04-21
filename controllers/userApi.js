const express = require("express");
const router = express.Router();
const axios = require("axios");
const getManagementApi = require("../utils/getManagementApi");

router.patch("/updateAccount", (req, res, next) => {
  console.log("Incoming request: ", req.body.data);

  getManagementApi()
    .then((response) => {
      const payload = req.body.data;
      const token = response.data;
      console.log("Req payload from client: ", payload);

      function updateUsername() {
        return axios({
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
          .then(function (response) {
            console.log("Update username attempt: ", response);
          })
          .catch(function (err) {
            console.log({
              errorMessage: err.message,
              errorResponse: err.response,
            });
          });
      }

      function updateUserEmail() {
        return axios({
          method: "PATCH",
          url: `${process.env.MANAGEMENT_API_AUDIENCE}users/${payload.id}`,
          headers: {
            authorization: `${token.token_type} ${token.access_token}`,
            "content-type": "application/json",
          },
          data: {
            email: payload.email
          },
        })
          .then(function (response) {
            console.log("Email update attempted: ", response);
          })
          .catch(function (err) {
            console.log({
              errorMessage: err.message,
              errorResponse: err.response,
            });
          });
      }

      function udpateUserMetadata() {
        return axios({
          method: "PATCH",
          url: `${process.env.MANAGEMENT_API_AUDIENCE}users/${payload.id}`,
          headers: {
            authorization: `${token.token_type} ${token.access_token}`,
            "content-type": "application/json",
          },
          data: {
            user_metadata: {
              firstName: payload.firstName,
              lastName: payload.lastName,
            },
          },
        })
          .then(function (response) {
            console.log("Update user metadata attempt: ",response);
          })
          .catch(function (err) {
            console.log({
              errorMessage: err.message,
              errorResponse: err.response,
            });
          });
      }

      Promise.all([
        updateUsername(),
        updateUserEmail(),
        udpateUserMetadata(),
      ]).then(function (results) {
        const username = results[0];
        const email = results[1];
        const metadata = results[2];
        res.json({
          message: "Success, promises were fulfilled",
          username: username,
          email: email,
          metadata: metadata,
        });
      });

      // call management api to update user details
    })
    .catch(function (error) {
      console.log("Error in getting the Auth0 auth token", error);
      next();
    });
});

module.exports = router;
