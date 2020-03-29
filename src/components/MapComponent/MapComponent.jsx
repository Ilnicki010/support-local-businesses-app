import React from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

import styles from "./MapComponent.module.scss";

class MapComponent extends React.Component {
  state = {
    viewport: {
      latitude: this.props.userLocation.lat,
      longitude: this.props.userLocation.lng,
      width: "100%",
      height: "40vh",
      zoom: 10,
    },
  };

  render() {
    const { viewport } = this.state;
    const { places, selectedPlace } = this.props;
    return (
      <div>
        <ReactMapGL
          {...viewport}
          mapStyle="mapbox://styles/mapbox/light-v9"
          onViewportChange={(viewportChange) =>
            this.setState({ viewport: viewportChange })
          }
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
        >
          {places.map((place) => (
            <Marker
              key={place.place.id}
              latitude={place.place.geometry.location.lat}
              longitude={place.place.geometry.location.lng}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <div
                className={styles.marker}
                onClick={() => this.props.handleSelectedPlace(place)}
              />
            </Marker>
          ))}
          {selectedPlace && (
            <Popup
              latitude={parseFloat(selectedPlace.geometry.location.lat)}
              longitude={parseFloat(selectedPlace.geometry.location.lng)}
            >
              {selectedPlace.name}
            </Popup>
          )}
        </ReactMapGL>
      </div>
    );
  }
}

export default MapComponent;
