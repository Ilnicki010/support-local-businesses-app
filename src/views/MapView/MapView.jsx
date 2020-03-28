import React from "react";
import axios from "axios";
import Airtable from "airtable";
import MapComponent from "../../components/MapComponent/MapComponent";

const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_KEY }).base(
  "app7LKgKsFtsq1x8D"
);

class MapView extends React.Component {
  state = {
    places: [],
    error: null,
    userLocation: { lat: null, long: null },
    selectedPlace: null,
  };

  componentDidMount() {
    this.getUserLocation().then((position) => {
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/${process.env.REACT_APP_GOOGLE_API__PLACES_ENDPOINT}/nearbysearch/json?key=${process.env.REACT_APP_GOOGLE_API_KEY}&location=${position.coords.latitude},${position.coords.longitude}&radius=10000&type=restaurant`
        )
        .then((data) => {
          this.setState({
            places: data.data.results,
            userLocation: {
              lat: position.coords.latitude,
              long: position.coords.longitude,
            },
          });
        });
    });
  }

  getUserLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        () =>
          reject("We Can not find your location, try type address using input")
      );
    });
  };

  setSelectedPlace = (place) => {
    this.setState({ selectedPlace: place });
    base("Table 1").find("recVm6SBLJTcZ5hpN", (err, record) => {
      if (err) return;
      if (record.fields.google_places_id === place.id) {
        this.setState((prevState) => ({
          selectedPlace: {
            gofundme_link: record.fields.gofundme_url,
            ...prevState.selectedPlace,
          },
        }));
      }
    });
  };

  render() {
    const {
      userLocation: { lat: userLat, long: userLong },
      selectedPlace,
      places,
      userLocation,
    } = this.state;
    return (
      <main>
        <h1>map view</h1>
        {userLat && userLong && places ? (
          <MapComponent
            selectedPlace={selectedPlace}
            places={places}
            userLocation={userLocation}
            handleSelectedPlace={(place) => this.setSelectedPlace(place)}
          />
        ) : (
          <h1>loading</h1>
        )}
        {selectedPlace && (
          <div>
            <h1>{selectedPlace.name}</h1>
            <h2>{selectedPlace.vicinity}</h2>
            <h3>{selectedPlace.gofundme_link}</h3>
            <img src={selectedPlace.icon} alt="" />
            <ul>
              {selectedPlace.types.map((el) => (
                <li>{el}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    );
  }
}

export default MapView;
