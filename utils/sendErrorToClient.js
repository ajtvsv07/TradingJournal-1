// object error helper
const sendErrorToClient = (res, err) => {
  res.send({
    success: false,
    message: err,
  });
};

module.exports = sendErrorToClient;
