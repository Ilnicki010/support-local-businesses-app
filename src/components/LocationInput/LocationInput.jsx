import React from "react";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import styles from "./LocationInput.module.scss";

class LocationInput extends React.Component {
  state = { address: "" };

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    this.setState({ address });
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.props.getLocationInfo(latLng, address))
      .catch(error => console.error("Error", error));
  };

  render() {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        searchOptions={{
          types: ["geocode"]
        }} /* restricts to places rather than business names */
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({
          getInputProps,
          suggestions,
          getSuggestionItemProps,
          loading,
          label
        }) => (
          <div className={styles.inputWrapper}>
            <input
              {...getInputProps({
                placeholder: "Set location...",
                className: "location-search-input",
                autoFocus: true
              })}
            />
            <div className={styles.autocompleteDropdown}>
              {loading && <div>Load(suggestion)</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? styles.suggestionItemActive
                  : styles.suggestionItem;

                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}
export default LocationInput;
