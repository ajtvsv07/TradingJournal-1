const express = require("express");
const router = express.Router();
const authenticated = require("../controllers/userApi");
const tdaHandler = require("../controllers/tdaHandler");

// update user account details with auth0 management api
router.post("/account/updateUserDetails", authenticated.updateUserDetails);

// send auth link details to client
router.get("/tda/tdaUserAuthLinkDetails", tdaHandler.tdaUserAuthLinkDetails);

// Connect TD Ameritrade Account: save tda tokens to database and update management API isTdaLinked status
router.post("/tda/updateAccStatusTokens", tdaHandler.updateAccStatusTokens);

// delete all account data from db, update isTdaLinked status
router.post("/tda/disconnectAccount", tdaHandler.disconnectAccount);

module.exports = router;
