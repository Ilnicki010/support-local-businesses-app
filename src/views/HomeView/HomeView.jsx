import React from "react";
import axios from "axios";
import Airtable from "airtable";
import styles from "./HomeView.module.scss";
import LocationInput from "../../components/LocationInput/LocationInput";
import BusinessesList from "../../components/BusinessesList/BusinessesList";
import Filters from "../../components/Filters/Filters";
import Button from "../../components/Button/Button";
import { FILTER_LIST, AUTO_SELECT_FIRST_FILTER } from "../../constants";
import MapComponent from "../../components/MapComponent/MapComponent";
import TextSearchInput from "../../components/TextSearchInput/TextSearchInput";
import TopLogo from "../../assets/SOSB_Logo_1600x648.png";

const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_KEY }).base(
  "app7LKgKsFtsq1x8D"
);

class HomeView extends React.Component {
  state = {
    searchQuery: {
      location: {
        name: "",
        lat: null,
        lng: null
      }
    },
    resultPlaces: [],
    filteredPlaces: [],
    loading: false,
    activePlace: null
  };

  placeType = {
    label: AUTO_SELECT_FIRST_FILTER ? FILTER_LIST[0].label : "",
    value: AUTO_SELECT_FIRST_FILTER ? FILTER_LIST[0].value : ""
  };

  keywords = "";

  // auto-submit when we have enough fields. for now disabling because it was calling multiple times for duplicate data
  checkForReadyToSearch = () => {
    const sq = this.state.searchQuery;
    if ((sq.location.name || sq.location.lat) && this.placeType.value) {
      // we have some new data, so let's click search for them
      // this.submitSearch(null);
    }
  };

  findPlaces = () => {
    this.setState({
      resultPlaces: [],
      loading: true
    });
    let uri;
    if (this.keywords) {
      uri = `${process.env.REACT_APP_PROXY}/maps/api/place/textsearch/json?key=${process.env.REACT_APP_GOOGLE_API_KEY}&location=${this.state.searchQuery.location.lat},${this.state.searchQuery.location.lng}&inputtype=textquery`;
      uri += `&input=${this.keywords}`;
      uri = encodeURI(uri);
    } else {
      uri = `${process.env.REACT_APP_PROXY}/maps/api/place/nearbysearch/json?key=${process.env.REACT_APP_GOOGLE_API_KEY}&location=${this.state.searchQuery.location.lat},${this.state.searchQuery.location.lng}&radius=10000`;
      // ignoring keywords for this search
      if (this.placeType.value) uri += `&types=${this.placeType.value}`;
    }
    console.log(uri);
    axios.get(uri).then(data => {
      if (!data.data.results) alert("No results for this query");
      data.data.results.forEach(place => {
        this.checkIsPlaceInDB(place).then(gofundmeURL => {
          this.setState(prevState => ({
            loading: false,
            resultPlaces: [
              {
                place,
                gofundmeURL: gofundmeURL || null
              },
              ...prevState.resultPlaces
            ],
            filteredPlaces: this.state.resultPlaces
          }));
        });
      });
    });
  };

  checkIsPlaceInDB = place => {
    return new Promise((resolve, reject) => {
      base("Table 1").find("recVm6SBLJTcZ5hpN", (err, record) => {
        if (err) reject(err);
        record.fields.google_places_id === place.id
          ? resolve(record.fields.gofundme_url)
          : resolve(null);
      });
    });
  };

  getLocation = (latlng, address) => {
    this.setState({
      searchQuery: {
        location: {
          name: address,
          lat: latlng.lat,
          lng: latlng.lng
        }
      },
      resultPlaces: [],
      filteredPlaces: [],
      loading: false
    });
    this.checkForReadyToSearch();
  };

  submitSearch = event => {
    if (event) event.preventDefault();
    this.findPlaces();
    console.log(event || "auto-submitting");
  };

  // callback function called on filterClicks (sends a CSV of selected values)
  getFilteredValues = (placeType, isSelect = false) => {
    if (isSelect)
      this.placeType = { value: placeType.value, label: placeType.label };
    else this.keywords = placeType.text;
    this.checkForReadyToSearch();
  };

  render() {
    return (
      <main className={styles.siteWrapper}>
        <header className={styles.siteHeader}>
          <div className={styles.TopLogoContainer}>
            <img
              src={TopLogo}
              alt="Save Small Biz"
              className={styles.TopLogo}
            />
          </div>{" "}
          <form
            onSubmit={event => this.submitSearch(event)}
            className={styles.inputsWrapper}
          >
            <div style={{ flex: "2" }}>
              <LocationInput
                getLocationInfo={(latlng, address) =>
                  this.getLocation(latlng, address)
                }
              />
            </div>
            <div style={{ flex: "2" }}>
              <Filters
                filterList={FILTER_LIST}
                filteredValuesHandler={this.getFilteredValues}
              />
            </div>
            <div style={{ flex: "2" }}>
              <TextSearchInput
                filteredValuesHandler={this.getFilteredValues}
              ></TextSearchInput>
            </div>

            <Button style={{ flex: "1" }} type="submit">
              Search
            </Button>
          </form>
        </header>
        <div className={styles.contentWrapper}>
          <section>
            {this.state.resultPlaces.length > 0 ? (
              <h2 className={styles.resultsTitle}>
                Search results for
                <span className={styles.specialText}>
                  {this.placeType.label}
                </span>
                near
                <span className={styles.specialText}>
                  {this.state.searchQuery.location.name}
                </span>
              </h2>
            ) : (
              ""
            )}
            {this.state.resultPlaces && (
              <BusinessesList
                listOfPlaces={this.state.resultPlaces}
                getActivePlace={place =>
                  this.setState({ activePlace: { ...place } })
                }
              />
            )}
            {this.state.loading && <span>loading...</span>}
          </section>
          <div>
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
    );
  }
}
export default HomeView;
