const { createDecipheriv } = require("crypto");

const decryptPayload = async (tokens) => {
  // tdTokens: {
  //   access_token: 'R4QZKj0ly0Ut1I0an3nN7Q==',
  //   refresh_token: 'qtxeta1LD2PdQ+qV7pns2g==',
  //   token_type: 'yNUse+BBkVlsLajym7pe5w==',
  //   expires_in: 'dLbVxsM6AhGcMUel7kEc7g==',
  //   scope: 'VGPKzMaZeqp9XO5wqp4eeOU+WpkRt0iy/YjKfiSoc7Y=',
  //   refresh_token_expires_in: 'dLbVxsM6AhGcMUel7kEc7g==',
  //   created_on: 1628208335812
  // }

  // string or buffer required by cipher.update
  const accssTkn = tokens["access_token"];
  const rfTkn = tokens["refresh_token"];
  const tknType = tokens["token_type"];
  const expIn = tokens["expires_in"];
  const scope = tokens["scope"];
  const rfTknExpIn = tokens["refresh_token_expires_in"];

  // values originaly stored as hex strings, converted into buffers for cipher method
  const encryptedKey = Buffer.from(process.env.CRYPTO_KEY, "hex");
  const iv = Buffer.from(process.env.CRYPTO_IV, "hex");

  // create unique ciphers for each decryption
  let accssTknDecipher = createDecipheriv("aes-256-cbc", encryptedKey, iv);
  let rfTknDecipher = createDecipheriv("aes-256-cbc", encryptedKey, iv);
  let tknTypeDecipher = createDecipheriv("aes-256-cbc", encryptedKey, iv);
  let expInDecipher = createDecipheriv("aes-256-cbc", encryptedKey, iv);
  let scopeDecipher = createDecipheriv("aes-256-cbc", encryptedKey, iv);
  let rfTknExpInDecipher = createDecipheriv("aes-256-cbc", encryptedKey, iv);

  // decrypt values. input: base64 string, output: utf8 string
  let decryptAccssTkn = accssTknDecipher.update(accssTkn, "base64", "utf8");
  let decryptRfTkn = rfTknDecipher.update(rfTkn, "base64", "utf8");
  let decryptTknType = tknTypeDecipher.update(tknType, "base64", "utf8");
  let decryptExpIn = expInDecipher.update(expIn, "base64", "utf8");
  let decryptScope = scopeDecipher.update(scope, "base64", "utf8");
  let decryptRfTknExpIn = rfTknExpInDecipher.update(
    rfTknExpIn,
    "base64",
    "utf8"
  );

  // finalize values to utf8 string
  decryptAccssTkn += accssTknDecipher.final("utf8");
  decryptRfTkn += rfTknDecipher.final("utf8");
  decryptTknType += tknTypeDecipher.final("utf8");
  decryptExpIn += expInDecipher.final("utf8");
  decryptScope += scopeDecipher.final("utf8");
  decryptRfTknExpIn += rfTknExpInDecipher.final("utf8");

  const formatData = {
    access_token: decryptAccssTkn,
    refresh_token: decryptRfTkn,
    token_type: decryptTknType,
    expires_in: decryptExpIn,
    scope: decryptScope,
    refresh_token_expires_in: decryptRfTknExpIn,
    createdOn: tokens.created_on,
  };

  return formatData;
};

module.exports = decryptPayload;
