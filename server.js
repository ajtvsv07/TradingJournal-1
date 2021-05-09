require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");

const HTTPS = require("https");
const FS = require("fs");

const app = express();
const PORT = process.env.PORT || 443;

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-deltanorth46.auth0.com/.well-known/jwks.json",
  }),
  // TODO: update this audience identifier in auth0 when app is deployed
  audience: "http://localhost:5000", // API identifier - checks that incoming requests also match this audience
  issuer: "https://dev-deltanorth46.auth0.com/",
  algorithms: ["RS256"],
});

// require("./config/database");

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

//Protects all of the routes
app.use(jwtCheck);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", require("./routes/index"));

app.use(express.static(path.join(__dirname, "/client/public")));

HTTPS.createServer(
  {
    key: FS.readFileSync("./localhost-key.pem"),
    cert: FS.readFileSync("./localhost.pem"),
  },
  app
).listen(PORT, () => {
  console.log("Server up and running on PORT: ", PORT);
});
// app.listen(PORT, () => console.log(`Server up and running on port ${PORT}!`));
