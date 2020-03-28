import React from "react";
import styles from "./BusinessesList.module.scss";
import Button from "../Button/Button";

const BusinessesList = ({ listOfPlaces }) => {
  const style = (photoRef) => ({
    background: `url(https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&sensor=false&maxheight=1600&maxwidth=1600&key=${process.env.REACT_APP_GOOGLE_API_KEY})`,
  });

  return (
    <ul>
      {listOfPlaces.map((place) => (
        <li className={styles.listElement}>
          <div
            className={styles.image}
            style={place.photos ? style(place.photos[0].photo_reference) : null}
          />
          <div className={styles.listElementContent}>
            <h3>{place.name}</h3>
            <span className={styles.listElementContentAddress}>
              {place.vicinity}
            </span>
          </div>
          <div className={styles.buttonWrapper}>
            <Button>Donate</Button>
          </div>
        </li>
      ))}
    </ul>
  );
};
export default BusinessesList;
