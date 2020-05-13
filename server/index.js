require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const airtable = require("airtable");
const session = require("express-session");
const Sentry = require("@sentry/node");
const constants = require('./constants');
const helpers = require('./helpers/helpers.js');
const routes = require('./routes/routes.js');
const {
      apiKey, airtableApiKey, airtableBaseId, recordTableName,
      port,detailsApiUrl,accountSid, authToken,serviceId, sentryUrl
  } = constants

var base;
var airtableRecords;
var client;
var apiParam;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(session({ secret: serviceId + accountSid + authToken }));

app.post("/sendClaim", function (req, res) {
  routes.sendVerification(req,res,constants,helpers,Sentry,client,base,airtableRecords,apiParam,https);
});

app.post("/checkClaim", function (req, res) {
  routes.checkVerification(req,res,constants,helpers,Sentry,client,base,airtableRecords,apiParam,https);
});

const server = app.listen(port, () => {
  console.log('e');
  if(!helpers.checkEnv(server,helpers,constants)) {
    return;
  }

  Sentry.init({
  dsn: sentryUrl,
  });

  client = require("twilio")(accountSid, authToken);
  base = new airtable({ apiKey: airtableApiKey }).base(airtableBaseId);
  apiParam = "key=".concat(apiKey);

  if(!client) {
    server.close();
    return;
  }

  if(!base) {
    server.close();
    return;
  }

  console.log(`Listening on port ${port}`);
});