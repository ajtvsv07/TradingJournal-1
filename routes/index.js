const express = require("express");
const router = express.Router();
const authenticated = require("../controllers/userApi");
const tdaHandler = require ("../controllers/tdaHandler");

// update user account details with auth0 management api
router.use("/account", authenticated);

// tda actions
router.use("/tda", tdaHandler);

module.exports = router;
