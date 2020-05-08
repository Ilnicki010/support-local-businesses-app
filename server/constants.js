module.exports = {
	apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
	airtableApiKey: process.env.REACT_APP_AIRTABLE_KEY,
	airtableBaseId: process.env.REACT_APP_AIRTABLE_BASE,
	recordTableName: process.env.REACT_APP_AIRTABLE_CLAIM_BUSINESS_TABLE,
	port : process.env.PORT || 7999,
	detailsApiUrl: "https://maps.googleapis.com/maps/api/place/details/json?",
	accountSid  : process.env.REACT_APP_TWILIO_SID,
	authToken : process.env.REACT_APP_TWILIO_API_KEY,
	serviceId : process.env.REACT_APP_TWILIO_SERVICE,
	sentryUrl: process.env.REACT_APP_SENTRY_URL
}