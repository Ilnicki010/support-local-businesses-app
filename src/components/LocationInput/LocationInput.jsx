import React, { useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { GPS_BUTTON } from "../../constants";
import Button from "../Button/Button";
import styles from "./LocationInput.module.scss";

const GPSIcons = require("../../assets/gps.svg");

function LocationInput({ getLocationInfo }) {
  const [address, setAddress] = useState("");

  const getUserLocation = () => {
    setAddress(GPS_BUTTON);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position, err) => {
        getLocationInfo(
          { lat: position.coords.latitude, lng: position.coords.longitude },
          GPS_BUTTON
        );
      });
    } else {
      // error
    }
  };

  const handleSelect = (addressFromInput) => {
    setAddress(addressFromInput);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => getLocationInfo(latLng, addressFromInput))
      .catch((error) => console.error("Error", error));
  };

  return (
    <div className={styles.wrapper}>
      <PlacesAutocomplete
        value={address}
        searchOptions={{
          types: ["geocode"],
        }} /* restricts to places rather than business names */
        onChange={(value) => setAddress(value)}
        onSelect={handleSelect}
      >
        {({
          getInputProps,
          suggestions,
          getSuggestionItemProps,
          loading,
          label,
        }) => (
          <div className={styles.inputWrapper}>
            <input
              {...getInputProps({
                placeholder: "Set location...",
                className: "location-search-input",
                autoFocus: true,
              })}
            />

            <div className={styles.autocompleteDropdown}>
              {loading && <div>Load(suggestion)</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? styles.suggestionItemActive
                  : styles.suggestionItem;

                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
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
      <div className={styles.buttonWrapper}>
        <button type="button" onClick={() => getUserLocation()}>
          <img height="20px" src={GPSIcons} alt="Near me" />
        </button>
      </div>
    </div>
  );
}
export default LocationInput;
