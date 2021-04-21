const axios = require("axios");

const client_id = process.env.MANAGEMENT_API_CLIENT_ID;
const client_secret = process.env.MANAGEMENT_API_CLIENT_SECRET;
const audience = process.env.MANAGEMENT_API_AUDIENCE;
const url = process.env.MANAGEMENT_API_URL;
const grant_type = process.env.MANAGEMENT_API_GRANT_TYPE;

//Call Management API and return a promise with the token ready to use
const getManagementApi = () => {
  return new Promise(async (resolve, reject) => {
    // console.log("Request coming in: ", req.body);
    try {
      const response = await axios({
        method: "POST",
        url: url,
        headers: { "content-type": "application/json" },
        data: {
          client_id: client_id,
          client_secret: client_secret,
          audience: audience,
          grant_type: grant_type,
        },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = getManagementApi;
