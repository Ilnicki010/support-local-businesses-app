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
  const { send_phone_num } = req.session;

  const sentry_extras = [
    { key: "place_id", value: place_Id },
    { key: "place_name", value: place_name },
    { key: "email", value: email },
    { key: "phone_number", value: send_phone_num },
    { key: "go_fund", value: go_fund },
  ];
  
  client.verify
    .services(serviceId)
    .verificationChecks.create({ to: send_phone_num, code: entered_code })
    .then(
      (verification_check) => {
        if (verification_check.status == "approved") {
          helpers.fetchAirtableId(base,constants,place_Id).then(
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
                     message: `Could not update verification for airtable ID: ${id} and phone number ${send_phone_num}`,
                    },
                    sentry_extras, Sentry
                  );
                  res.status(400).send(reason1);
                  return;
                }
              );
            },
            (reason2) => {
              helpers.logSentry(
                    { key: "/check", value: `Airtable ID fetch error` },
                       email,
                    {
                     name: "Airtable ID fetch error",
                     message: reason2,
                    },
                    sentry_extras, Sentry
                  );
              res.status(400).send(reason2);
              return;
            }
          );
        }

        else {
          helpers.logSentry(
            { key: "/check", value: `Code denied` },
            email,
            { name: "Code Denied", message: `Code ${entered_code} is incorrect for ${send_phone_num}` },
            sentry_extras, Sentry
          );
          res.status(400).send("Code denied");
          return;
        }
      },
        (reason) => {
          helpers.logSentry(
            { key: "/check", value: `Verification Check Failed` },
            email,
            { name: "Verification Check Failed", message: `Verification check failed for ${send_phone_num}` },
            sentry_extras, Sentry
          );
          res.status(400).send(reason);
          return;
        }
      );
}