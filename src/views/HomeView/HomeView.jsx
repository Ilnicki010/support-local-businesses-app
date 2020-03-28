import React from "react";
import axios from "axios";
import styles from "./HomeView.module.scss";
import LocationInput from "../../components/LocationInput/LocationInput";
import BusinessesList from "../../components/BusinessesList/BusinessesList";

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
  };

  findPlaces = () => {
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/${process.env.REACT_APP_GOOGLE_API__PLACES_ENDPOINT}/nearbysearch/json?key=${process.env.REACT_APP_GOOGLE_API_KEY}&location=${this.state.searchQuery.location.lat},${this.state.searchQuery.location.lng}&radius=10000&type=restaurant`
      )
      .then((data) => {
        this.setState({
          resultPlaces: data.data.results,
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
    this.findPlaces();
  };

  render() {
    return (
      <main>
        <span>{`Search results for bussiness in ${this.state.searchQuery.location.name}`}</span>
        <div>
          <LocationInput
            getLocationInfo={(latlng, address) =>
              this.getLocation(latlng, address)
            }
          />
          <input type="text" />
        </div>
        <div className={styles.contentWrapper}>
          <div />
          <div>
            {this.state.resultPlaces && (
              <BusinessesList listOfPlaces={this.state.resultPlaces} />
            )}
          </div>
          <div />
        </div>
      </main>
    );
  }
}
export default HomeView;
