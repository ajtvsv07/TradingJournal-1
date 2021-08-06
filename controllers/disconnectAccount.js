const sendErrorToClient = require("../utils/sendErrorToClient");
const TdAccessCred = require("../models/tdAccessCred");
const getManagementApi = require("../utils/getManagementApi");
const updateManagementApi = require("../utils/updateManagementApi");

// delete all account data from db, update isTdaLinked status
const disconnectAccount = (req, res, next) => {
  const userId = req.body.data.user;

  const deleteAccessCreds = new Promise((resolve, reject) => {
    TdAccessCred.findByIdAndDelete(userId, (err, userDeleted) => {
      if (userDeleted) {
        resolve(`Deleted user creds successfully`);
      } else {
        reject("No existing TD Ameritrade connection found");
      }
    });
  });

  // 1: Find and delete user creds from database
  deleteAccessCreds
    .then((resolved) => {
      // get token to communicate with management api
      getManagementApi()
        .then((response) => {
          const apiToken = response.data;
          const linked = false;

          // 2: Update status
          updateManagementApi(userId, apiToken, linked)
            .then((result) => {
              // 3: respond to client
              res.send({
                success: true,
                message: "Your account has been disconnected",
              });
            })
            .catch((error) => {
              sendErrorToClient(res, `Request error. ${error}`);
            });
        })
        .catch((error) => {
          sendErrorToClient(res, `API token error. ${error}`);
        });
    })
    .catch((error) => {
      sendErrorToClient(
        res,
        `There was a problem in deleting the tokens. ${error}`
      );
    });
};

module.exports = disconnectAccount;
