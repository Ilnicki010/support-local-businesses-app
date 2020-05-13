# Backend service for SaveSmall

The primary goal for this backend service is to enable a user to claim their business


## Setup Instructions
- Clone the Repository
- Navigate to the root directory
- Run npm install to install the dependencies
- Run node run server for prod or node run server-dev for development work

## Endpoints:

# /sendClaim
- POST Request
- Content-Type: application/json
- Body parameters: place_id, place_name, email, phone_number, go_fund
- This endpoint will validate the user's phone number and then send him a code via call
- Returned HTTP codes and responses:
	- 200: 'Already claimed by user'
	- 200: 'Successfully sent confirmation'
	- 403: Error message from google place details, Sentry exception: Fetch PlaceID Error
	- 401: 'Invalid phone number', Sentry exception: Number mismatch Error
	- 403: Error message from Twilio, Sentry exception: Verification create error
	- 400: 'Missing body parameters'

# /checkClaim
- POST request
- Content-Type: application/json
- Body parameters: code
- This endpoint will validate the code sent to a user and accordingly update a user's record in airtable
- Returned HTTP codes and responses:
	- 200: 'Verified'
	- 403: Error message from Airtable, Sentry exception: Verification update error, Airtable ID fetch error
	- 401: 'Code Denied', Sentry exception: Code Denied
	- 403: Error message from Twilio, Sentry exception: Verification Check Failed
	- 400: 'Missing body parameters'