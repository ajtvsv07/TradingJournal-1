const calcTokenExpiration = (req, res, next) => {
  console.log("Testing the calcTokenExpiration middleware!");
  next();
};

module.exports = calcTokenExpiration;
