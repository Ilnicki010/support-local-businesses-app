## intro

Small businesses (restaurants, bars, cleaners, etc.) are suffering. Many will go broke during quarantines and all will struggle to get business back afterwards. This not only affects the owners, but the employees of those businesses and ultimately the patrons. Our over-arching goal is to help small businesses weather the storm in the short term and be positioned to recover and thrive in the long term by (a) helping the businesses know who their most supportive patrons are, and (b) providing a method for consumers to see their local businesses in need and link out to funding/support mechanisms (e.g. TipJar, GoFundMe, etc.)

## todo

### core features:

- [ ] The selected specific place should ping different endpoint (high priority)
- [x] Integrate map
- [ ] Clam your business/Add campaign - link to Airtable form
- [x] Integrate airtable with support the business form
- [x] Filters
- [x] Zooming in on map changes search
- [x] Change screen update so that results are added onto the bottom of the array
- [ ] Delete node_modules folder and run just to make sure all the required files are in package.json
- [ ] Add to instructions, especially related to .env and keys and Airtable accounts, etc.

### bugs

- [x] Map update
- [x] Display images
- [ ] Do not use setState in componentDidUpdate. work-with-map branch need closer look and refactor ( zoom to the point feature)

### improvements

- [ ] Find/scrape campaign info binded with a place and put it to the Airtable as a starting point
- [ ] Deal with paging of results so user can get more by scrolling down page
- [ ] Put a button underneath the map. “Redo Search for Visible Map Area”
- [ ] Styling, styling, styling
- [ ] Figure out if we can bring up GoFundMe embed without leaving page
- [ ] Move some logic to the back end eg. Airtable search
- [ ] Add props validation
- [ ] Lint all the components/views

## tech stack

- react v16.3
- react-router v5.1.2
- react-mapbox-gl v5.2.3
- axios v0.19.2
- airtable v0.8.1
- node-sass v.4.13.1

## npm scripts

- `npm run start` run app in development mode (default port: 3000)
- `npm run build` build for production
- `npm run lint` lint all js/jsx files
