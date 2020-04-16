// Push package.json
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('https');

const port = 7999;
const apiKey = 'AIzaSyCZnuVCuprSIGEXolvCg7bkf23LWnQmebw';
const apiParam = 'key='.concat(apiKey);
//app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())

app.post('/checkClaim', function(req,res) {
	
	const searchApiUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?';
	const detailsApiUrl = 'https://maps.googleapis.com/maps/api/place/details/json?';
	const nameParam = 'input='.concat(req.body.name);
	
	const searchUri= searchApiUrl.concat(nameParam).concat('&').concat(apiParam).concat('&').concat('inputtype=textquery');

	getDataPromise(searchUri).then(value => {
		  if(value.status != 'OK') {
		  	res.status(400).send(value.error_message || value.status);
		  	return;
		  }
		  const placeIds = getPlaceID(value);

		  let promiseArray = []

		  for(placeId of placeIds) {
		  	const placeParam = 'place_id='.concat(placeId);
		  	const detailsUri= detailsApiUrl.concat(placeParam).concat('&').concat(apiParam).concat('&fields=formatted_phone_number,international_phone_number');
		  	promiseArray.push(getDataPromise(detailsUri));

		  }

		  Promise.all(promiseArray).then(function(values) {
		  	result = [];
  			for(value of values) {
  				result.push(value.result);
  			}
  			res.status(200).send(result);
  			return;
			});

		}, reason => {
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