## intro

Small businesses (restaurants, bars, cleaners, etc.) are suffering. Many will go broke during quarantines and all will struggle to get business back afterwards. This not only affects the owners, but the employees of those businesses and ultimately the patrons. Our over-arching goal is to help small businesses weather the storm in the short term and be positioned to recover and thrive in the long term by (a) helping the businesses know who their most supportive patrons are, and (b) providing a method for consumers to see their local businesses in need and link out to funding/support mechanisms (e.g. TipJar, GoFundMe, etc.)

## todo

### core features:
- [ ] Would be really cool if, after you submit your email address, that button turns green and from "Support" to "Supporter"
- [ ] Map: Hovers on top of businesses and click scrolls you to that business and pops open the Support section
- [x] Integrate map
- [ ] Clam your business/Add campaign - link to Airtable form
- [x] Integrate airtable with support the business form
- [x] Filters
- [x] Zooming in on map changes search
- [x] Change screen update so that results are added onto the bottom of the array
- [ ] Add to instructions, especially related to .env and keys and Airtable accounts, etc.

### bugs

- [ ] Search by keyword, reset after first search
- [x] Map update
- [x] Display images
- [ ] Do not use setState in componentDidUpdate. work-with-map branch need closer look and refactor ( zoom to the point feature)

### improvements
- [ ] Map: auto-scale the map to match the actual results of the search so the used area is as big as possible
- [ ] Need to add a captcha for the email submission
- [ ] Find/scrape campaign info binded with a place and put it to the Airtable as a starting point
- [ ] Update "Supported" logos on page with results of the ones you have supported already (for return visitors)
- [ ] Deal with paging of results so user can get more by scrolling down page
- [ ] Put a button underneath the map. “Redo Search for Visible Map Area”
- [ ] Styling, styling, styling
- [ ] Figure out if we can bring up GoFundMe embed without leaving page
- [ ] Move some logic to the back end eg. Airtable search
- [ ] Add props validation
- [ ] Lint all the components/views
- [ ] Delete node_modules folder and run just to make sure all the required files are in package.json

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

## npm scripts

- `npm run start` run app in development mode (default port: 3000)
- `npm run build` build for production
- `npm run lint` lint all js/jsx files
