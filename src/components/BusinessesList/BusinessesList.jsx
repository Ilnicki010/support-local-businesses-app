import React from "react";
import styles from "./BusinessesList.module.scss";
import Button from "../Button/Button";
import { SHOW_IMAGES } from "../../constants";

const BusinessesList = ({ listOfPlaces }) => {
  const getPhoto = photoRef => {
    const url = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&sensor=false&maxheight=100&maxwidth=100&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
    return SHOW_IMAGES
      ? { backgroundImage: `url(${url})`, width: "100%", height: "100%" }
      : {};
  };
  return (
    <div>
      {listOfPlaces.map((placeObject, i) => (
        <div className={styles.listElement} key={i}>
          <div
            className={styles.image}
            style={
              placeObject.place.photos
                ? getPhoto(placeObject.place.photos[0].photo_reference)
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
        </div>
      ))}
    </div>
  );
};
export default BusinessesList;
