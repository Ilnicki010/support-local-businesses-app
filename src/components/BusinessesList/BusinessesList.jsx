import React, { Component } from "react";
import styles from "./BusinessesList.module.scss";
import Button from "../Button/Button";
import { SHOW_IMAGES } from "../../constants";

class BusinessesList extends Component {
  state = { activePlace: null };

  handleShowYourSupport = id => {
    this.setState({
      activePlace: id
    });
  };

  submitSupport = e => {
    e.preventDefault();
    console.log(e);

    // //// CALL Chinonso FUNCTION HERE
  };

  render() {
    const getPhoto = photoRef => {
      const url = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&sensor=false&maxheight=100&maxwidth=100&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
      return SHOW_IMAGES
        ? { "background-image": `url(${url})`, width: "100%", height: "100%" }
        : {};
    };

    const { listOfPlaces } = this.props;
    return (
      <div className="business-tile">
        {listOfPlaces.map(placeObject => (
          <div className={styles.listElement} key={placeObject.place.id}>
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
                <Button
                  onClick={() =>
                    this.handleShowYourSupport(placeObject.place.id)
                  }
                >
                  Support
                </Button>
              )}
            </div>
            {this.state.activePlace === placeObject.place.id && (
              <div className={styles.formWrapper}>
                <div className={styles.headerCard}>
                  <span className={styles.headerCardTitle}>
                    Tell them you are with them
                  </span>
                  <button
                    className={styles.closeButton}
                    type="submit"
                    onClick={() => this.setState({ activePlace: null })}
                  >
                    Cancel
                  </button>
                </div>

                <form
                  className={styles.supportForm}
                  onSubmit={e => this.submitSupport(e)}
                >
                  <label className={styles.supportFormLabel}>
                    <span className={styles.supportFormLabelText}>
                      Privide an email address to get information how you can
                      help this business to survive
                    </span>
                    <input
                      className={styles.supportFormInput}
                      placeholder="eg. john.doe@gmail.com"
                      type="email"
                      required
                    />
                  </label>
                  <Button type="submit">Send</Button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
}
export default BusinessesList;
