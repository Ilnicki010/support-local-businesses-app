module.exports = function(req,res,constants,helpers,Sentry,client,base,airtableRecords,apiParam,https) {
  const {
      apiKey, airtableApiKey, airtableBaseId, recordTableName,
      port,detailsApiUrl,accountSid, authToken,serviceId, sentryUrl
  } = constants;
  const place_Id = req.body.place_id;
  const { place_name } = req.body;
  const { email } = req.body;
  const { phone_number } = req.body;
  const { go_fund } = req.body;
  req.session.place_Id = place_Id;
  req.session.place_name = place_name;
  req.session.email = email;
  req.session.phone_number = phone_number;
  req.session.go_fund = go_fund;

  const sentry_extras = [
    { key: "place_id", value: place_Id },
    { key: "place_name", value: place_name },
    { key: "email", value: email },
    { key: "phone_number", value: phone_number },
    { key: "go_fund", value: go_fund },
  ];

  const placeParam = "place_id=".concat(place_Id);
  const detailsUri = detailsApiUrl
    .concat(placeParam)
    .concat("&")
    .concat(apiParam)
    .concat("&fields=formatted_phone_number,international_phone_number");

  console.log(detailsUri);
  helpers.placeDetails(detailsUri,https).then(
    (value) => {
      if (value.status != "OK") {
        helpers.logSentry(
          { key: "/claim", value: `Couldnt fetch place id` },
          email,
          {
            name: "Fetch PlaceID Error",
            message: `Couldnt fetch placeid${place_Id}`,
          },
          sentry_extras, Sentry
        );
        console.log('one1');
        res.status(400).send(value.error_message || value.status);
        return;
      }
      
      if (
        helpers.editPhone(value.result.formatted_phone_number) !=
          helpers.editPhone(phone_number) &&
        helpers.editPhone(value.result.international_phone_number) !=
          helpers.editPhone(phone_number)
      ) {
        const error_p = `${helpers.editPhone(
          value.result.formatted_phone_number
        )}or${helpers.editPhone(value.result.international_phone_number)}`;
        helpers.logSentry(
          { key: "/claim", value: `Given phone did not match` },
          email,
          {
            name: "Number mismatch Error",
            message: `Given phone did not match${error_p}`,
          },
          sentry_extras, Sentry
        );
        console.log('one2');
        res.status(400).send("Invalid phone number");
        return;
      }
    
      client.verify
        .services(serviceId)
        .verifications.create({ to: phone_number, channel: "sms" })
        .then(
          (verification) => {
            console.log(verification);
            if (verification.status == "approved") {
              res.status(200).send("Already claimed by user");
              return;
            }
            else {
              res.status(200).send("Successfully sent confirmation");
              return;
            }
          },
          (reason) => {
            helpers.logSentry(
              { key: "/claim", value: `Verification create error` },
                 email,
              {
               name: "Twilio Verification send error",
               message: `Could not create verification for $value.result.international_phone_number `,
              },
              sentry_extras, Sentry
            );
            res.status(400).send(reason);
            return;
          }
        );
    },
    (reason) => {
      helpers.logSentry(
          { key: "/claim", value: `Couldnt fetch place id` },
          email,
          {
            name: "Fetch PlaceID Error",
            message: `Couldnt fetch placeid${place_Id}`,
          },
          sentry_extras, Sentry
        );
      console.log(reason);
      res.status(400).send(reason);
      return;
    }
  );
}