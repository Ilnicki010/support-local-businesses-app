import React from "react";
import Airtable from "airtable";
import ReactDependentScript from "react-dependent-script";
import styles from "./HomeView.module.scss";
import LocationInput from "../../components/LocationInput/LocationInput";
import BusinessesList from "../../components/BusinessesList/BusinessesList";
import Button from "../../components/Button/Button";
import {
  FILTER_LIST,
  SEARCH_ERROR_MESSAGE,
  AUTO_SELECT_FIRST_FILTER,
} from "../../constants";
import TopLogo from "../../assets/SOSB_Logo_1600x648.png";
import MapComponent from "../../components/MapComponent/MapComponent";
import InputSelectCombo from "../../components/InputSelectCombo/InputSelectCombo";

const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_KEY }).base(
  process.env.REACT_APP_AIRTABLE_BASE
);
class HomeView extends React.Component {
  state = {
    searchQuery: {
      location: {
        name: "",
        lat: null,
        lng: null,
      },
    },
    resultPlaces: [],
    filteredPlaces: [],
    loading: false,
    activePlace: null,
  };

  placeType = {
    /*
    label: AUTO_SELECT_FIRST_FILTER ? FILTER_LIST[0].label : "",
    value: AUTO_SELECT_FIRST_FILTER ? FILTER_LIST[0].value : "",
    */
  };

  keywords = "";

  checkForReadyToSearch = (event = null, isAutoSubmit = false) => {
    const sq = this.state.searchQuery;
    const missing = [];
    if (!(sq.location.lat && sq.location.lng)) missing.push("Location");
    if (!(this.keywords || this.placeType.value))
      missing.push("Business type filter/keywords");
    if (!isAutoSubmit || (isAutoSubmit && !missing.length))
      if (!missing.length) {
        // we have some new data, so let's click search for them
        this.submitSearch(event);
      } else {
        alert(
          `${SEARCH_ERROR_MESSAGE};\nMissing: ${
            missing.length > 1 ? missing.join(" and ") : missing
          }`
        );
      }
  };

  processSinglePlace = (place) => {
    this.checkIsPlaceInDB(place).then((gofundmeURL) => {
      this.setState((prevState) => ({
        loading: false,
        resultPlaces: [
          {
            place: {
              ...place,
              geometry: {
                location: {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                },
              },
            },
            gofundmeURL: gofundmeURL || null,
          },
          ...prevState.resultPlaces,
        ],
        filteredPlaces: this.state.resultPlaces,
      }));
    });
  };

  findPlaces = () => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    this.setState({
      resultPlaces: [],
      loading: true,
    });
    if (this.keywords) {
      service.textSearch(
        {
          location: {
            lat: this.state.searchQuery.location.lat,
            lng: this.state.searchQuery.location.lng,
          },
          radius: "9000",
          query: this.keywords,
        },
        (results, status) =>
          results.map((place) => this.processSinglePlace(place))
      );
    } else {
      service.nearbySearch(
        {
          location: {
            lat: this.state.searchQuery.location.lat,
            lng: this.state.searchQuery.location.lng,
          },
          radius: "9000",
          type: [this.placeType.value],
        },
        (results, status) =>
          results.map((place) => this.processSinglePlace(place))
      );
    }
  };

  checkIsPlaceInDB = (place) => {
    const filter = `AND({google_places_id} = "${place.id}",{is_verified} = 1)`;
    return new Promise((resolve, reject) => {
      base(process.env.REACT_APP_AIRTABLE_CLAIM_BUSINESS_TABLE)
        .select({
          // Selecting the first 3 records in Grid view:
          maxRecords: 1,
          view: "Grid view",
          filterByFormula: filter,
        })
        .eachPage(
          function page(records, fetchNextPage) {
            records.length > 0
              ? resolve(records[0].fields.gofundme_url)
              : resolve(null);
          },
          function done(err) {
            if (err) reject(err);
          }
        );
    });
  };

  getLocation = (latlng, address) => {
    this.setState({
      searchQuery: {
        location: {
          name: address,
          lat: latlng.lat,
          lng: latlng.lng,
        },
      },
      resultPlaces: [],
      filteredPlaces: [],
      loading: false,
    });
    this.checkForReadyToSearch(null, true);
  };

  submitSearch = (event) => {
    if (event) event.preventDefault();
    this.findPlaces();
  };

  // callback function called on filterClicks (sends a CSV of selected values)
  getFilteredValues = (placeType, isSelect = false) => {
    if (isSelect)
      this.placeType = { value: placeType.value, label: placeType.label };
    else this.keywords = placeType.text;
    this.checkForReadyToSearch(null, true);
  };

  onOptionSelect = (value) => {
    this.getFilteredValues({ value }, true);
  };

  // called when the user types something not in the quick select list and then tabs, returns or clicks/blurs out of the field
  onFreeTextEntry = (value) => {
    this.getFilteredValues({ text: value }, false);
  };

  render() {
    return (
      <ReactDependentScript
        scripts={[
          `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`,
        ]}
      >
        <main className={styles.siteWrapper}>
          <header className={styles.siteHeader}>
            <div className={styles.headerItemsContainer}>
              <div className={styles.TopLogoContainer}>
                <img
                  src={TopLogo}
                  alt="Save Small Biz"
                  className={styles.TopLogo}
                />
              </div>
              <div className={styles.locationBox}>
                <LocationInput
                  getLocationInfo={(latlng, address) =>
                    this.getLocation(latlng, address)
                  }
                />
              </div>
              <div className={styles.filterContainer}>
                <InputSelectCombo
                  className={styles.searchFilterInput}
                  placeholder="Select search type or enter keywords..."
                  options={FILTER_LIST}
                  onOptionSelect={this.onOptionSelect}
                  onFreeTextEntry={this.onFreeTextEntry}
                />
              </div>
              {/** 
              <div className={styles.buttonContainer}>
                <Button
                  className={styles.submitButton}
                  type="submit"
                  onClick={(event) => this.checkForReadyToSearch(event, false)}
                >
                  Search
                </Button>
              </div>
                */}
            </div>
          </header>
          <div className={styles.resultsTableWrapper}>
            <section>
              {this.state.resultPlaces.length > 0 ? (
                <h2 className={styles.resultsTitle}>
                  Search results for
                  {this.keywords ? (
                    <span className={styles.specialText}>{this.keywords}</span>
                  ) : (
                    <span className={styles.specialText}>
                      {this.placeType.label}
                    </span>
                  )}
                  near
                  <span className={styles.specialText}>
                    {this.state.searchQuery.location.name}
                  </span>
                </h2>
              ) : null}
              {this.state.resultPlaces && (
                <BusinessesList
                  listOfPlaces={this.state.resultPlaces}
                  getActivePlace={(place) =>
                    this.setState({ activePlace: { ...place } })
                  }
                />
              )}
              {this.state.loading && <span>loading...</span>}
            </section>
            <div className={styles.mapWrapper}>
              {this.state.searchQuery.location.lat && (
                <MapComponent
                  userLocation={this.state.searchQuery.location}
                  places={this.state.resultPlaces}
                  activePlace={this.state.activePlace}
                />
              )}
            </div>
          </div>
        </main>
      </ReactDependentScript>
    );
  }
}
export default HomeView;
