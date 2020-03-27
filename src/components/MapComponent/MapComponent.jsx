import React from "react";
import ReactMapGL, { Marker } from "react-map-gl";

import * as turf from "@turf/turf";
import styles from "./MapComponent.module.scss";

class MapComponent extends React.Component {
  state = {
    viewport: {
      width: "100%",
      height: "40vh",
      zoom: 10,
    },
  };

  render() {
    const { viewport } = this.state;
    const { userLocation, places } = this.props;
    return (
      <div>
        <ReactMapGL
          {...viewport}
          latitude={userLocation.lat}
          longitude={userLocation.long}
          mapStyle="mapbox://styles/mapbox/light-v9"
          onViewportChange={(viewportChange) =>
            this.setState({ viewport: viewportChange })
          }
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
        >
          {places.map((place) => (
            <Marker
              latitude={place.geometry.location.lat}
              longitude={place.geometry.location.lng}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <div className={styles.marker} />
            </Marker>
          ))}
        </ReactMapGL>
      </div>
    );
  }
}

export default MapComponent;
