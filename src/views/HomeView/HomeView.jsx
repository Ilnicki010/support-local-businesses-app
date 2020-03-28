import React from "react";

import styles from "./HomeView.module.scss";
import LocationInput from "../../components/LocationInput/LocationInput";

class HomeView extends React.Component {
  state = {
    searchQuery: {
      location: null,
    },
  };

  getLocation = (latlng) => {
    this.setState({
      searchQuery: {
        location: latlng,
      },
    });
  };

  render() {
    return (
      <main>
        <span>Search results for bussiness in locatioon</span>
        <div>
          <LocationInput getLatLng={(latlng) => this.getLocation(latlng)} />
          <input type="text" />
        </div>
        <div className={styles.contentWrapper} />
      </main>
    );
  }
}
export default HomeView;
