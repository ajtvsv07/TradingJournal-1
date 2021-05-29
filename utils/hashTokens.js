const bcrypt = require("bcrypt");
const saltRounds = 10;
// const payload = require("./jsonSample.json");

const hashedTokens = (payload) => {
  return new Promise((resolve, reject) => {
    // stringify integer values in JSON
    const stringifyPayload = () => {
      return new Promise((resolve, reject) => {
        let stringedTokens = {};
        let count = 0;
        // convert all object values to string
        for (const i in payload) {
          if (payload.hasOwnProperty(i)) {
            stringedTokens[i] = String(payload[i]);
          }
          count += 1;
          if (count >= 5) {
            resolve(stringedTokens);
          }
        }
      });
    };

    const hashTokens = (value) => {
      return new Promise((resolve, reject) => {
        let hashedTokens = {};
        let count = 0;
        for (const x in value) {
          bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(value[x], salt, function (err, hash) {
              hashedTokens[x] = hash;
              count += 1;

              if (count >= 5) {
                resolve(hashedTokens);
              }
            });
          });
        }
      });
    };

    stringifyPayload()
      .then((value) => hashTokens(value))
      .then((result) => resolve(result));
  });
};

module.exports = hashedTokens;
