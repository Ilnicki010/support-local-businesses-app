module.exports = function(req,res,constants,helpers,Sentry,client,base,airtableRecords,apiParam,https) {
  const {
      apiKey, airtableApiKey, airtableBaseId, recordTableName,
      port,detailsApiUrl,accountSid, authToken,serviceId, sentryUrl
  } = constants;
  const entered_code = req.body.code;
  const place_Id = req.session.place_id;
  const { place_name } = req.session;
  const { email } = req.session;
  const { phone_number } = req.session;
  const { go_fund } = req.session;
  const sentry_extras = [
    { key: "place_id", value: place_Id },
    { key: "place_name", value: place_name },
    { key: "email", value: email },
    { key: "phone_number", value: phone_number },
    { key: "go_fund", value: go_fund },
  ];

  client.verify
    .services(serviceId)
    .verificationChecks.create({ to: phone_number, code: entered_code })
    .then(
      (verification_check) => {
        if (verification_check.status == "approved") {
          helpers.fetchAirtableId(place_id,airtableRecords).then(
            (id) => {
              helpers.updateClaim(id,constants,base).then(
                (val) => {
                  res.status(200).send("Verified");
                  return;
                },
                (reason1) => {
                  helpers.logSentry(
                    { key: "/check", value: `Verification update error` },
                       email,
                    {
                     name: "Verification update error",
                     message: `Could not update verification for airtable ID: $id `,
                    },
                    sentry_extras, Sentry
                  );
                  res.status(400).send(reason1);
                  return;
                }
              );
            },
            (reason2) => {
              res.status(400).send(reason2);
              return;
            }
          );
        }
        helpers.logSentry(
          { key: "/checkVerification", value: `${entered_code}Code denied` },
          email,
          { name: "Code Denied", message: `${entered_code} is incorrect` },
          sentry_extras, Sentry
        );
        res.status(400).send("Code denied");
        return;
      },
      (reason) => {
        res.status(400).send(reason);
        return;
      }
    );
}