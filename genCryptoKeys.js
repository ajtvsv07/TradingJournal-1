const crypto = require("crypto");
const fs = require("fs");

const genKey = () => {
  // crypto.createDecipheriv() & crypto.createCipheriv() will use these random keys as the encryptedKey and iv
  // these methods require the encryptedKey and iv to be 'utf8' encoded strings, Buffers, TypedArray, or DataViews
  // these methods allow for an algorithm of choice, which specifically requires the encryptedKey and iv to be a certain number of bits
  // in this case algo "aes-256-cbc" is being used, which requires the ecryptedKey to be 256 bits, and the iv to be 128 bits
  // 256 bits = 32 bytes
  // 128 bits = 16 bytes
  // create random buffer. Encode as hex string
  const encryptionKey = crypto.randomBytes(32).toString("hex");

  // open path to file with "append" flag to .env file
  fs.open(".env", "a", function (err, fd) {
    if (err) {
      throw "could not open file: " + err;
    }

    // write the contents of the keys
    fs.write(fd, encryptionKey, function (err, written, string) {
      if (err) throw "error writing file: " + err;
      console.log(string);
      console.log(written); // how many bytes the passed string required to be written

      fs.close(fd, function () {
        console.log("wrote the file successfully");
      });
    });
  });
};

module.exports = genKey();
