module.exports = {
	fetchRecords : require('./airtable_records'),
	checkEnv: require('./check_environment'),
	editPhone: require('./edit_phone'),
	fetchAirtableId: require('./fetch_airtable_id_from_place'),
	logSentry: require('./log_sentry'),
	placeDetails: require('./place_details'),
	updateClaim : require('./update_claim')
}