const { createDecipheriv } = require("crypto");

const decryptPayload = async (value) => {
  // data to decrypt
  const dataToDecrypt = value.encryptedTokens;

  // values originaly stored as hex strings, converted into buffers for cipher method
  const encryptedKey = Buffer.from(process.env.CRYPTO_KEY, "hex");
  const iv = Buffer.from(process.env.CRYPTO_IV, "hex");

  let decipher = createDecipheriv("aes-256-cbc", encryptedKey, iv);
  let decrypted = decipher.update(dataToDecrypt, "base64", "utf8"); // input: base64, output: utf-8 string
  decrypted += decipher.final("utf8"); // append any remaining in-cipher contents

  const parsed = JSON.parse(decrypted);
  const data = parsed.tdTokens;

  return data;
};

module.exports = decryptPayload;
