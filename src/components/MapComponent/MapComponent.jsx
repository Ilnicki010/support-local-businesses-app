import React from "react";
import mapboxgl from "mapbox-gl";

import * as turf from "@turf/turf";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

class MapComponent extends React.Component {
  componentDidMount() {
    const { userLocation, places } = this.props;
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [userLocation.long, userLocation.lat],
      zoom: 10,
    });
    this.map.on("load", () => {
      places.map((place) => {
        new mapboxgl.Marker()
          .setLngLat([place.geometry.location.lng, place.geometry.location.lat])
          .addTo(this.map);
      });
      const center = turf.point([userLocation.long, userLocation.lat]);
      const radius = 10;
      const options = {
        steps: 20,
        units: "kilometers",
      };

      const circle = turf.circle(center, radius, options);
      this.map.addLayer({
        id: "circle-outline",
        type: "line",
        source: {
          type: "geojson",
          data: circle,
        },
        paint: {
          "line-color": "blue",
          "line-opacity": 0.3,
          "line-width": 4,
          "line-offset": 5,
        },
      });
    });
  }

  render() {
    return (
      <div>
        <div
          ref={(el) => {
            this.mapContainer = el;
          }}
        />
      </div>
    );
  }
}

export default MapComponent;
