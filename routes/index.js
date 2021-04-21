const express = require("express");
const router = express.Router();

const authenticated = require("../controllers/userApi");

//Send link details to auth0
router.use("/user", authenticated);

module.exports = router;
