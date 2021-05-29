const bcrypt = require("bcrypt");

const saltRounds = 10;

const hashPayload = async (value) => {
  // hashes strings
  const saltAndHashStrings = async (data) => {
    const hashed = bcrypt.hash(data, saltRounds);
    return await hashed;
  };

  // outputs object with hashsed strings
  const handleStrings = async (val, name) => {
    let hashedValue = {};
    let hashValue = await saltAndHashStrings(val);
    hashedValue[`${name}`] = hashValue;
    return hashedValue;
  };

  const hashedTokens = async (payload) => {
    // outputs object with all string values
    const stringifyPayload = async (tokenObject) => {
      let stringedValues = {};
      for (const i in tokenObject) {
        if (tokenObject.hasOwnProperty(i)) {
          stringedValues[i] = String(tokenObject[i]);
        }
      }
      return stringedValues;
    };

    // outputs object with hashed values
    const hashTokens = async () => {
      const stringedPayload = await stringifyPayload(payload);
      let hashedTokens = {
        tdTokens: {},
      };
      for (const x in stringedPayload) {
        let hashValue = await saltAndHashStrings(stringedPayload[x]);
        hashedTokens.tdTokens[x] = hashValue;
      }
      return hashedTokens;
    };
    return await hashTokens();
  };

  // combines all hashed values and returns a single object
  const returnAllHashedContent = async () => {
    let tdAuthCode = handleStrings(value.tdAuthCode, "tdAuthCode");
    let userId = handleStrings(value.userId, "userId");
    let tdTokens = hashedTokens(value.tdTokens);

    const objectArray = await Promise.all([tdAuthCode, userId, tdTokens]);

    let mergedResults = {};
    objectArray.map((xObject) => {
      for (const key in xObject) {
        mergedResults[key] = xObject[key];
      }
    });
    return mergedResults;
  };

  return await returnAllHashedContent();
};

module.exports = hashPayload;
