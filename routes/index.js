const express = require("express");
const router = express.Router();
const authenticated = require("../controllers/userApi");
const tdaHandler = require("../controllers/tdHandler");
const tdAmResources = require("../controllers/tdAmResources");

// GET

// send auth link details to client
router.get("/tda/tdUrlDetails", tdaHandler.tdUrlDetails);

// ------------------------------------------------------

// POST

// update user account details with auth0 management api
router.post("/account/updateUserDetails", authenticated.updateUserDetails);

// Connect TD Ameritrade Account: save tda tokens to database and update management API isTdaLinked status
router.post("/tda/connectAccount", tdaHandler.connectAccount);

// retrieve td tokens and their expiration
router.post("/tda/tdAccessTokens", tdAmResources.retrieveTdTokens);

// delete all account data from db, update isTdaLinked status
router.post("/tda/disconnectAccount", tdaHandler.disconnectAccount);

module.exports = router;
