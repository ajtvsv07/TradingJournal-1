const express = require("express");
const router = express.Router();

const tdUrlDetails = require("../controllers/tdUrlDetails");

const userProfileDetails = require("../controllers/userProfileDetails");
const connectAccount = require("../controllers/connectAccount");
const retrieveTdTokens = require("../controllers/tdTokenCreds/retrieveTdTokens");
const disconnectAccount = require("../controllers/disconnectAccount");

// MIDDLEWARE
const calcTokenExpiration = require("../controllers/tdTokenCreds/calcTokenExpiration");
const reqNewAccToken = require("../controllers/tdTokenCreds/reqNewAccToken");
const reqNewRefreshToken = require("../controllers/tdTokenCreds/reqNewRefreshToken");

// GET

// send auth link details to client
router.get("/tda/tdUrlDetails", tdUrlDetails);

// ------------------------------------------------------

// POST

// update user account details with auth0 management api
router.post("/account/profileDetails", userProfileDetails);

// Connect TD Ameritrade Account: save tda tokens to database and update management API isTdaLinked status
router.post("/tda/connectAccount", connectAccount);

// retrieve td tokens and their expiration
router.post("/tda/tdAccessTokens", calcTokenExpiration, retrieveTdTokens);

// delete all account data from db, update isTdaLinked status
router.post("/tda/disconnectAccount", disconnectAccount);

module.exports = router;
