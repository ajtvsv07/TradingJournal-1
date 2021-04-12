const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/authlink", (req, res, next) => {
    User.findOne({ _id: req.body.email })
      .then((user) => {
        const isValid = authHelper.validPassword(
          req.body.password,
          user.hash,
          user.salt
        );

        if (isValid) {
          //Issue JWT - Send to client
          const jwt = authHelper.issueJWT(user);

          res
            .cookie("testSiteCookie", jwt, {
              //1hour in milliseconds
              maxAge: 3600000,
              httpOnly: true,
              signed: true,
            })
            .status(200)
            .json({
              success: true,
              message: "Login Successful",
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              expiresIn: jwt.expires,
            });
        }
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: "Email or password is incorrect",
        });
      });
  }
);

module.exports = router;
