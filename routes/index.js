const express = require("express");
const router = express.Router();

const tdUrlDetails = require("../controllers/tdUrlDetails");
const userProfileDetails = require("../controllers/userProfileDetails");
const connectAccount = require("../controllers/connectAccount");
const retrieveTdTokens = require("../controllers/tdTokenCreds/retrieveTdTokens");
const disconnectAccount = require("../controllers/disconnectAccount");
const updateTdAccessToken = require("../controllers/tdTokenCreds/updateTdAccessToken");
const updateTdRefreshToken = require("../controllers/tdTokenCreds/updateTdRefreshToken");

// MIDDLEWARE
const calcTokenExpiration = require("../controllers/tdTokenCreds/calcTokenExpiration");
const reqNewAccToken = require("../controllers/tdTokenCreds/updateTdAccessToken");
const reqNewRefreshToken = require("../controllers/tdTokenCreds/updateTdRefreshToken");

// ------------------------------------------------------
// GET

// send auth link details to client
router.get("/tda/tdUrlDetails", tdUrlDetails);

// ------------------------------------------------------
// POST

// Connect TD Ameritrade Account: save tda tokens to database and update management API isTdaLinked status
router.post("/tda/connectAccount", connectAccount);

// retrieve td tokens and their expiration
router.post("/tda/tdAccessTokens", calcTokenExpiration, retrieveTdTokens);

// ------------------------------------------------------
// PUT
// update user account details with auth0 management api
// TODO: UPDATE TO PUT
router.post("/account/profileDetails", userProfileDetails);

// ------------------------------------------------------
// PATCH

// update new access token
router.patch("/tda/updateAccessToken", updateTdAccessToken);

// TODO: update new refresh token
// router.patch("/tda/updateRefreshToken", updateTdRefreshToken);

// ------------------------------------------------------
// DELETE

// delete all account data from db, update isTdaLinked status
router.post("/tda/disconnectAccount", disconnectAccount);

module.exports = router;
