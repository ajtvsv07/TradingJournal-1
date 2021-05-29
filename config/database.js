const mongoose = require("mongoose");

const devConnection = process.env.DB_STRING;
const prodConnection = process.env.DB_STRING_PROD;

function connectToMongoose(environment) {
  mongoose.connect(environment, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.on("connected", () => {
    console.log("DB connected correctly to server");
  }).catch((error) => console.log("Error in connection attempt: ", error));
}

if (process.env.NODE_ENV === "production") {
  connectToMongoose(prodConnection);
} else {
  connectToMongoose(devConnection);
}
