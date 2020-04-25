// Push package.json
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('https');
const airtable = require('airtable');
const session = require('express-session');

const apiKey = 'AIzaSyCZnuVCuprSIGEXolvCg7bkf23LWnQmebw';
const airtableApiKey = 'keyI2ZGah01mhEQdC';
const airtableBaseId = 'app7LKgKsFtsq1x8D';
const recordTableName = 'Table 1';
const apiParam = 'key='.concat(apiKey);
const port = 7999;
const base = new airtable({apiKey: airtableApiKey}).base(airtableBaseId);
const detailsApiUrl = 'https://maps.googleapis.com/maps/api/place/details/json?';	

// Change this to env variables
const accountSid = 'AC28436f699d27ca14159bd182a91209b6';
const authToken = '59791088984e7dde72c021e2443a1df3';
const client = require('twilio')(accountSid, authToken);
const serviceId = 'VA55b6f02979e6b058bf0afd7c3b11c7c2';

const Sentry = require('@sentry/node');
Sentry.init({dsn: 'https://efda0ec150f044478be5ff6b08620fd9@o373129.ingest.sentry.io/5188892'});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())

app.use(session({secret: serviceId+accountSid+authToken}));

app.post('/claim', function(req,res) {
	const place_Id = req.body.place_id;
	const place_name = req.body.place_name;
	const email = req.body.email;
	const phone_number = req.body.phone_number;
	const go_fund = req.body.go_fund;
	req.session.place_Id = place_Id;
	req.session.place_name = place_name;
	req.session.email = email;
	req.session.phone_number = phone_number;
	req.session.go_fund = go_fund;


	const sentry_extras = [{key:'place_id',value:place_Id}, {key:'place_name',value:place_name}, {key:'email',value:email}, {key:'phone_number',value:phone_number}, {key:'go_fund',value: go_fund}];
	
	const placeParam = 'place_id='.concat(placeId); 
	const detailsUri= detailsApiUrl.concat(placeParam).concat('&').concat(apiParam).concat('&fields=formatted_phone_number,international_phone_number');

	getDataPromise(detailsUri).then(value => {
		if(value.status != 'OK') {
		  sendSentryException({key:'/claim',value:'Couldnt fetch place id' + place_Id}, email, {name: 'Fetch PlaceID Error',message:'Couldnt fetch placeid' + place_Id}, sentry_extras);
		  res.status(400).send(value.error_message || value.status);
		  return;
		}

		// Check phone number
		if(removeAllChars(value.formatted_phone_number) != removeAllChars(phone_number) && removeAllChars(value.international_phone_number) != removeAllChars(phone_number)) {
			var error_p = removeAllChars(value.formatted_phone_number) + 'or' + removeAllChars(value.international_phone_number);
			sendSentryException({key:'/claim',value:'Given phone did not match' + error_p}, email, {name: 'Number mismatch Error',message:'Given phone did not match' + error_p}, sentry_extras);
			res.status(400).send('Invalid phone number');
		}
		console.log(value);
		client.verify.services(serviceId).verifications.create({to: phone_number , channel: 'call'}).then(verification => {
			console.log(verification)
			if(verification.status == 'pending') {
				res.status(200).send('Successfully sent confirmation');
				return;
			}
			if(verification.status == 'approved') {
				res.status(200).send('Already claimed by user');
				return 
			}
			else {
				sendSentryException({key:'/claim',value:'Verification check denied'}, email, {name: 'Verification Check Denied',message:'Claim was previously denied'}, sentry_extras);
				res.status(400).send('Claim was previously denied');
				return 
			}
			
		}, reason => {
			console.log(reason);
			res.status(400).send(reason);
			return;
		});
				 
		}, reason => {
		  res.status(400).send(reason);
		  return;
		});

});

app.post('/checkVerification', function(req,res) {
	const entered_code = req.body.code;
	const place_Id = req.session.place_id;
	const place_name = req.session.place_name;
	const email = req.session.email;
	const phone_number = req.session.phone_number;
	const go_fund = req.session.go_fund; 
	const sentry_extras = [{key:'place_id',value:place_Id}, {key:'place_name',value:place_name}, {key:'email',value:email}, {key:'phone_number',value:phone_number}, {key:'go_fund',value: go_fund}];

	client.verify.services(serviceId).verificationChecks.create({to: phone_number, code: entered_code}).then(verification_check => {
		console.log(verification_check)
		if(verification_check.status == 'approved') {
			// Update Airtable
			fetchIdFromPlaceId(place_id).then(id => {
				updateRecordToIsVerified(id).then(val => {
					res.status(200).send('Verified');
					return;
				}, reason1 => {
					res.status(400).send(reason1);
		  			return;
				})
			}, reason2 => {
				res.status(400).send(reason2);
		  		return;
			})
		}
		sendSentryException({key:'/checkVerification',value:entered_code+'Code denied'}, email, {name: 'Code Denied',message:entered_code + ' is incorrect'}, sentry_extras);
		res.status(400).send('Code denied');

	}, reason => {
		console.log(reason);
		res.status(400).send(reason);
		return;
	});
});

app.listen(port, () => console.log(`Listening on port ${port}!`));

function getDataPromise(url) {
	return new Promise(function(resolve,reject) {
		https.get(url, (resp) => {
	  	let data = '';

		  // A chunk of dat	a has been recieved.
	  	resp.on('data', (chunk) => {
	    	data += chunk;
	  	});

	  	// The whole response has been received. Print out the result.
	  	resp.on('end', () => {
	  		resolve(JSON.parse(data));
	  	});

		}).on("error", (err) => {
			reject(err.message);
	  		console.log("Error: " + err.message);
		});
	});
}

function getPlaceID(value) {
	var candidates = value.candidates;
	var ids = []
	for(candidate of candidates) {
		ids.push(candidate.place_id);
	}
	return ids;
}

function fetchAllRecords() {
	return new Promise(function(resolve, reject) {
		record_data = [];
		base(recordTableName).select({
			fields: ["id", "google_places_id"]
			}).eachPage(function page(records, fetchNextPage) {

				// This function (`page`) will get called for each page of records.

				records.forEach(function(record) {
					record_data.push({
						id: record['id'],
						place_id: record.get('google_places_id')
					});
				});

				// To fetch the next page of records, call `fetchNextPage`.
				// If there are more records, `page` will get called again.
				// If there are no more records, `done` will get called.
				fetchNextPage();

			}, function done(error) {
				if (error) {
					console.log(error);
					reject(error);
				}
				resolve(record_data);
			});
	});
}

function fetchIdFromPlaceId(place_id) {
	return new Promise(function(resolve, reject) {
		fetchAllRecords().then(records => {
			for(record of records) {
				if(record['place_id'] == place_id) {
					 resolve(record['id']);
					 return;
				}
			}
			reject('Record not found');
		});
	});
}

// fetchIdFromPlaceId('cf1739b85fab2d64b2373c326efe3ed0e179899e').then(val => { console.log(val) } );

function updateRecordToIsVerified(id) {
	var updateJson =  {
		id: id,
		fields: {
			is_verified: true
		}
	}

	return base(recordTableName).update([updateJson]);
}

function sendSentryException(tag,email,error,extras) {
	if(!error)
		return;
	if(!error.name)
		return;

	Sentry.configureScope(scope => {

		if(extras) {
			for(extra of extras) {
				if(extra.key && extra.value)
  					scope.setExtra(extra.key, extra.value);
			}
		}

		if(tag && tag.key && tag.value) {
			scope.setTag(tag.key, tag.value);
		}

		if(email)
  			scope.setUser({email: email});
	});
	 
	 var e = new Error();
	 e.name = error.name;
	 e.message = error.message;
	 Sentry.captureException(e);

}

function removeAllChars(phone_number) {
	var new_phone = '';
	for(var char of phone_number) {
		var x = char - '0';
		if(isNaN(x))
			continue;
		if(char == ' ')
			continue;

		new_phone += x;
	}
	return new_phone
}