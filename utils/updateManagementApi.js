const axios = require("axios");

// update management API account link status
const updateManagementApi = (userId, apiToken, linked) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "PATCH",
      url: `${process.env.MANAGEMENT_API_AUDIENCE}users/${userId}`,
      headers: {
        authorization: `${apiToken.token_type} ${apiToken.access_token}`,
        "content-type": "application/json",
      },
      data: {
        user_metadata: {
          preferences: {
            isTdaLinked: linked,
          },
        },
      },
    }).then(
      (result) => {
        resolve(result.data);
      },
      (error) => {
        reject(error);
      }
    );
  });
};

module.exports = updateManagementApi;
