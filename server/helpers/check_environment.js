module.exports = function(server,helpers,constants) {

	const {
  		apiKey, airtableApiKey, airtableBaseId, recordTableName,
  		port,detailsApiUrl,accountSid, authToken,serviceId,sentryUrl
	} = constants;

	if(!apiKey) {
    	server.close();
    	return false;
  	}

  	if(!airtableApiKey || !airtableBaseId || !recordTableName) {
    	server.close();
    	return false;
  	}

  	if(!accountSid || !authToken || !serviceId) {
    	server.close();
    	return false;
  }

  if(!sentryUrl) {
    server.close();
    return false;
  }
  return true;
}