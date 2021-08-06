const mongoose = require("mongoose");

// Create Schema
const TdAccess = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  tdTokens: {
    type: Object,
    required: true,
  },
  tdAuthCode: {
    type: String,
    required: true,
  },
});

const TdAccessCred = mongoose.model("TdAccessCred", TdAccess);

module.exports = TdAccessCred;
