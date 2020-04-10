# SaveSmall.org
Struggling to survive, small businesses are turning to crowdfunding. S.O.S. pulls together local campaigns into a single view so neighbors can easily support the businesses they love.

[Live Demo](https://savesmall.org)

## intro

Small businesses (restaurants, bars, cleaners, etc.) are suffering. Many will go broke during quarantines and all will struggle to get business back afterwards. This not only affects the owners, but the employees of those businesses and ultimately the patrons. Our over-arching goal is to help small businesses weather the storm in the short term and be positioned to recover and thrive in the long term by (a) helping the businesses know who their most supportive patrons are, and (b) providing a method for consumers to see their local businesses in need and link out to funding/support mechanisms (e.g. TipJar, GoFundMe, etc.).
You can read more about the project [here](https://devpost.com/software/support-local-businesses)

## tech stack

- react v16.3
- react-router v5.1.2
- react-mapbox-gl v5.2.3
- axios v0.19.2
- airtable v0.8.1
- node-sass v.4.13.1
- react-select v.3.1.0
- d3-ease v1.0.6
- react-places
- react-places-autocomplete
- turf-point
- ...a lot of React 


## development

 1.  Start with cloning the git repo ` git clone https://github.com/Ilnicki010/support-local-businesses-app.git &&support-local-businesses-app`
  2. You need to install all dependencies using ` npm install --save `
  3. Create ` .env ` file as follows
```
REACT_APP_AIRTABLE_KEY= airtable api key
REACT_APP_AIRTABLE_BASE= id of your airtable base
REACT_APP_AIRTABLE_CLAIM_BUSINESS_TABLE= table name for businesses(*1)
REACT_APP_AIRTABLE_WAITING_LIST_TABLE= table name for emails(*2)
REACT_APP_GOOGLE_API_KEY= google api key
REACT_APP_MAPBOX_KEY= mapbox api key
```
(*1) The table must have columns named exactly like that: “google_places_id”, “gofundme_url”, “place_name”, “is_verified”, “phone_number” and “email”.
(*2) The table must have columns named exactly like that: "placeName", "placeId ", "email".

  5. Run development server using ` npm run start`
  


## npm scripts

- `npm run start` run app in development mode (default port: 3000)
- `npm run build` build for production
- `npm run lint` lint all js/jsx files
