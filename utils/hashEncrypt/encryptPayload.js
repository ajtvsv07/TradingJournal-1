const { createCipheriv } = require("crypto");

const encryptPayload = async (value) => {
  const dataToEncrypt = {
    tdTokens: value.tdTokens,
    tdAuthCode: value.tdAuthCode,
  };

  // values originaly stored as hex strings, converted into buffers for cipher method
  const encryptedKey = Buffer.from(process.env.CRYPTO_KEY, "hex");
  const iv = Buffer.from(process.env.CRYPTO_IV, "hex");

  // string or buffer required by cipher.update
  const data = JSON.stringify(dataToEncrypt);

  let cipher = createCipheriv("aes-256-cbc", encryptedKey, iv);
  let encrypted = cipher.update(data, "utf8", "base64"); // input: utf-8 string, output: base64
  encrypted += cipher.final("base64"); // append any remaining in-cipher contents

  return encrypted;
};

module.exports = encryptPayload;
