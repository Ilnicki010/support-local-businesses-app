import React from "react";
import axios from "axios";

import MapComponent from "../../components/MapComponent/MapComponent";

class MapView extends React.Component {
  state = { places: [], error: null, userLocation: { lat: null, long: null } };

  getUserLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        () =>
          reject("We Can not find your location, try type address using input")
      );
    });
  };

  componentDidMount() {
    this.getUserLocation().then(position => {
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/${process.env.REACT_APP_GOOGLE_API__PLACES_ENDPOINT}/nearbysearch/json?key=${process.env.REACT_APP_GOOGLE_API_KEY}&location=${position.coords.latitude},${position.coords.longitude}&radius=10000&type=restaurant`
        )
        .then(data => {
          this.setState({
            places: data.data.results,
            userLocation: {
              lat: position.coords.latitude,
              long: position.coords.longitude
            }
          });
        });
    });
  }
  render() {
    const { lat: userLat, long: userLong } = this.state.userLocation;
    return (
      <main>
        <h1>map view</h1>
        {userLat && userLong && this.state.places ? (
          <MapComponent
            places={this.state.places}
            userLocation={this.state.userLocation}
          />
        ) : (
          <h1>loading</h1>
        )}
      </main>
    );
  }
}

export default MapView;
