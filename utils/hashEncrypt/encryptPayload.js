const { createCipheriv } = require("crypto");

const encryptPayload = async (value) => {
  const tokens = value.tdTokens;

  // string or buffer required by cipher.update
  const accssTkn = tokens["access_token"];
  const rfTkn = tokens["refresh_token"];
  const tknType = tokens["token_type"];
  const expIn = JSON.stringify(tokens["expires_in"]);
  const scope = tokens["scope"];
  const rfTknExpIn = JSON.stringify(tokens["refresh_token_expires_in"]);
  const tdAuthCode = value.tdAuthCode;

  // values originaly stored as hex strings, converted into buffers for cipher method
  const encryptedKey = Buffer.from(process.env.CRYPTO_KEY, "hex");
  const iv = Buffer.from(process.env.CRYPTO_IV, "hex");

  // create unique ciphers for each encryption
  let accssTknCipher = createCipheriv("aes-256-cbc", encryptedKey, iv);
  let rfTknCipher = createCipheriv("aes-256-cbc", encryptedKey, iv);
  let tknTypeCipher = createCipheriv("aes-256-cbc", encryptedKey, iv);
  let expInCipher = createCipheriv("aes-256-cbc", encryptedKey, iv);
  let scopeCipher = createCipheriv("aes-256-cbc", encryptedKey, iv);
  let rfTknExpInCipher = createCipheriv("aes-256-cbc", encryptedKey, iv);
  let tdAuthCodeCipher = createCipheriv("aes-256-cbc", encryptedKey, iv);

  // encrypt values. input: utf-8 string, output: base64
  let encryptAccssTkn = accssTknCipher.update(accssTkn, "utf8", "base64");
  let encryptRfTkn = rfTknCipher.update(rfTkn, "utf8", "base64");
  let encryptTknType = tknTypeCipher.update(tknType, "utf8", "base64");
  let encryptExpIn = expInCipher.update(expIn, "utf8", "base64");
  let encryptScope = scopeCipher.update(scope, "utf8", "base64");
  let encryptRfTknExpIn = rfTknExpInCipher.update(rfTknExpIn, "utf8", "base64");
  let encryptTdAuthCode = tdAuthCodeCipher.update(tdAuthCode, "utf8", "base64");

  // finalize values to base64 string
  encryptAccssTkn += accssTknCipher.final("base64");
  encryptRfTkn += rfTknCipher.final("base64");
  encryptTknType += tknTypeCipher.final("base64");
  encryptExpIn += expInCipher.final("base64");
  encryptScope += scopeCipher.final("base64");
  encryptRfTknExpIn += rfTknExpInCipher.final("base64");
  encryptTdAuthCode += tdAuthCodeCipher.final("base64");

  const formatData = {
    tdTokens: {
      access_token: encryptAccssTkn,
      refresh_token: encryptRfTkn,
      token_type: encryptTknType,
      expires_in: encryptExpIn,
      scope: encryptScope,
      refresh_token_expires_in: encryptRfTknExpIn,
      created_on: tokens.createdOn,
    },
    tdAuthCode: encryptTdAuthCode,
  };

  return formatData;
};

module.exports = encryptPayload;
