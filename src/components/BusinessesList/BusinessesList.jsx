import React from "react";
import styles from "./BusinessesList.module.scss";
import Button from "../Button/Button";

const BusinessesList = ({ listOfPlaces }) => {
  const style = photoRef => ({
    backgroundImage: `url(https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&sensor=false&maxheight=1600&maxwidth=1600&key=${process.env.REACT_APP_GOOGLE_API_KEY})`
  });
  return (
    <ul>
      {listOfPlaces.map((placeObject, i) => (
        <li className={styles.listElement} key={i}>
          <div
            className={styles.image}
            style={
              placeObject.place.photos
                ? style(placeObject.place.photos[0].photo_reference)
                : null
            }
          />
          <div className={styles.listElementContent}>
            <h3>{placeObject.place.name}</h3>
            <span className={styles.listElementContentAddress}>
              {placeObject.place.vicinity}
            </span>
          </div>
          <div className={styles.buttonWrapper}>
            {placeObject.gofundmeURL ? (
              <Button href={placeObject.gofundmeURL}>Donate</Button>
            ) : (
              <Button>Support</Button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};
export default BusinessesList;
