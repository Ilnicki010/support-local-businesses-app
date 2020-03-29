import React from "react";
import axios from "axios";
import Airtable from "airtable";
import styles from "./HomeView.module.scss";
import LocationInput from "../../components/LocationInput/LocationInput";
import BusinessesList from "../../components/BusinessesList/BusinessesList";
import Filters from "../../components/Filters/Filters";
import { FILTER_LIST } from "../../constants";
import MapComponent from "../../components/MapComponent/MapComponent";

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
    loading: false
  };

  placeTypes = "";

  findPlaces = () => {
    this.setState({
      loading: true
    });
    const uri = `https://cors-anywhere.herokuapp.com/${process.env.REACT_APP_GOOGLE_API__PLACES_ENDPOINT}/nearbysearch/json?key=${process.env.REACT_APP_GOOGLE_API_KEY}&location=${this.state.searchQuery.location.lat},${this.state.searchQuery.location.lng}&radius=10000&types=${this.placeTypes}`;
    console.log(uri);
    axios.get(uri).then(data => {
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
            ]
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
      }
    });
    this.findPlaces();
  };

  // callback function called on filterClicks (sends a CSV of selected values)
  getFilteredValues = filtersCSV => {
    this.placeTypes = filtersCSV;
  };

  render() {
    return (
      <main className={styles.siteWrapper}>
        <header className={styles.siteHeader}>
          <div className={styles.inputsWrapper}>
            {" "}
            <LocationInput
              getLocationInfo={(latlng, address) =>
                this.getLocation(latlng, address)
              }
            />
            <input type="text" />
          </div>
        </header>
        <span className={styles.resultsTitle}>
          {this.state.searchQuery.location.name
            ? `Search results for related to: ${this.state.searchQuery.location.name}`
            : ""}
        </span>
        <div className={styles.contentWrapper}>
          <div>
            <Filters
              filterList={FILTER_LIST}
              filteredValuesHandler={this.getFilteredValues}
            />
          </div>
          <div>
            {this.state.resultPlaces && (
              <BusinessesList listOfPlaces={this.state.resultPlaces} />
            )}
            {this.state.loading && <span>loading...</span>}
          </div>
          <div>
            {this.state.searchQuery.location.lat && (
              <MapComponent
                userLocation={this.state.searchQuery.location}
                places={this.state.resultPlaces}
              />
            )}
          </div>
        </div>
      </main>
    );
  }
}
export default HomeView;
