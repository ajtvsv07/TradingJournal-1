const express = require("express");
const router = express.Router();
const axios = require("axios");
const getManagementApi = require("../utils/getManagementApi");

router.post("/updateAccount", (req, res, next) => {
  getManagementApi()
    .then((response) => {
      const payload = req.body.data;
      const token = response.data;
      // console.log("Req payload: ", payload);

      // reqFeedback: 'Success, your user details have been updated.',
      // loading: false,
      // firstName: 'Daniel',
      // lastName: 'Lopez',
      // email: 'tgdpez@hotmail.com',
      // username: 'tgdpez',
      // id: 'auth0|6081dc0bfcccc40069c90dff',
      // newEmail: false
    

      function updateUser() {
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
        });
      }

      function otherDetails() {
        return axios({
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
        });
      }

      function sendEmailVerification() {
          return axios({
            method: "POST",
            url: `${process.env.MANAGEMENT_API_AUDIENCE}jobs/verification-email`,
            headers: {
              authorization: `${token.token_type} ${token.access_token}`,
              "content-type": "application/json",
            },
            data: {
              user_id: payload.id,
            },
          });
      }

      // TODO: find a way to execute "sendEmailVerification", only after the other promises have finished

      const handlePromises = ()=>{
        console.log("New email?: ", payload.newEmail);
        if (payload.newEmail) {
          return Promise.all([updateUser(), otherDetails(), sendEmailVerification()])
        }else{
          return Promise.all([updateUser(), otherDetails()]);
        }
      }

      handlePromises()
        .then(function (results) {
          const user = results[0].data;
          const otherDetails = results[1].data;

          res.json({
            success: true,
            message: "Success, your user details have been updated.",
            username: user.username,
            email: otherDetails.email,
            metadata: otherDetails.user_metadata,
          });
        })
        .catch((error) => {
          console.log(error.response.data);
          res.json({
            success: false,
            message: "There was an error with the promise requests",
            error: error.response.data,
          });
        });
    })
    .catch(function (error) {
      console.log("Error in getting the Auth0 auth token", error.data);
      res.json({
        success: false,
        message: "Error in getting the Auth0 auth token",
        error: error.data,
      });
      next();
    });
});

module.exports = router;
