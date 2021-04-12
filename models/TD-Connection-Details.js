const mongoose = require("mongoose");

// Create Schema
const ConnectionDetails = new mongoose.Schema({
  callbackUrl: {
    type: String,
    required: false,
  },
  consumerKey: {
    type: String,
    required: false,
  },
});

const TDConnectionDetails = mongoose.model(
  "tdConnectionDetails",
  ConnectionDetails
);

module.exports = TDConnectionDetails;
