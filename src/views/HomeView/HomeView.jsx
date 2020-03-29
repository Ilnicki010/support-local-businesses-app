import React from "react";
import axios from "axios";
import Airtable from "airtable";
import styles from "./HomeView.module.scss";
import LocationInput from "../../components/LocationInput/LocationInput";
import BusinessesList from "../../components/BusinessesList/BusinessesList";
import Filters from "../../components/Filters/Filters";
import Button from "../../components/Button/Button";
import { FILTER_LIST } from "../../constants";

const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_KEY }).base(
  "app7LKgKsFtsq1x8D"
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
  };

  placeType = {
    label: "",
    value: "",
  };

  findPlaces = () => {
    this.setState({
      resultPlaces: [],
      loading: true,
    });
    const uri = `https://cors-anywhere.herokuapp.com/${process.env.REACT_APP_GOOGLE_API__PLACES_ENDPOINT}/nearbysearch/json?key=${process.env.REACT_APP_GOOGLE_API_KEY}&location=${this.state.searchQuery.location.lat},${this.state.searchQuery.location.lng}&radius=10000&types=${this.placeType.value}`;
    console.log(uri);
    axios.get(uri).then((data) => {
      data.data.results.forEach((place) => {
        this.checkIsPlaceInDB(place).then((gofundmeURL) => {
          this.setState((prevState) => ({
            loading: false,
            resultPlaces: [
              {
                place,
                gofundmeURL: gofundmeURL || null,
              },
              ...prevState.resultPlaces,
            ],
            filteredPlaces: this.state.resultPlaces,
          }));
        });
      });
    });
  };

  checkIsPlaceInDB = (place) => {
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
          lng: latlng.lng,
        },
      },
    });
  };

  submitSearch = (event) => {
    event.preventDefault();
    this.findPlaces();
    console.log(event);
  };

  // callback function called on filterClicks (sends a CSV of selected values)
  getFilteredValues = (placeType) => {
    this.placeType = { value: placeType.value, label: placeType.label };
  };

  render() {
    return (
      <main className={styles.siteWrapper}>
        <header className={styles.siteHeader}>
          <form
            onSubmit={(event) => this.submitSearch(event)}
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
            <Button style={{ flex: "1" }} type="submit">
              Search
            </Button>
          </form>
        </header>
        <div className={styles.contentWrapper}>
          <section>
            <h2 className={styles.resultsTitle}>
              {this.state.resultPlaces.length > 0
                ? `Search results for '${this.placeType.label}' near '${this.state.searchQuery.location.name}'`
                : ""}
            </h2>
            {this.state.resultPlaces && (
              <BusinessesList listOfPlaces={this.state.resultPlaces} />
            )}
            {this.state.loading && <span>loading...</span>}
          </section>
          <div />
        </div>
      </main>
    );
  }
}
export default HomeView;
