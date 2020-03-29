import React, { Component } from "react";
import styles from "./BusinessesList.module.scss";
import Button from "../Button/Button";
import { SHOW_IMAGES } from "../../constants";

class BusinessesList extends Component {
  state = { activePlace: null };

  baseState = this.state;

  handleShowYourSupport = (place) => {
    this.setState({
      activePlace: { ...place },
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activePlace !== this.state.activePlace) {
      this.props.getActivePlace(this.state.activePlace);
    }
  }

  submitSupport = (e) => {
    e.preventDefault();
    console.log(e);

    // //// CALL Chinonso FUNCTION HERE
  };

  render() {
    const style = (photoRef) => ({
      backgroundImage: `url(https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&sensor=false&maxheight=1600&maxwidth=1600&key=${process.env.REACT_APP_GOOGLE_API_KEY})`,
    });
    const { listOfPlaces } = this.props;
    return (
      <ul>
        {listOfPlaces.map((placeObject) => (
          <li className={styles.listElement} key={placeObject.place.id}>
            <div
              className={styles.image}
              // style={
              //   placeObject.place.photos
              //     ? style(placeObject.place.photos[0].photo_reference)
              //     : null
              // }
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
                  onClick={() => this.handleShowYourSupport(placeObject.place)}
                >
                  Support
                </Button>
              )}
            </div>
            {this.state.activePlace &&
            this.state.activePlace.id === placeObject.place.id ? (
              <div className={styles.formWrapper}>
                <div className={styles.headerCard}>
                  <span className={styles.headerCardTitle}>
                    Tell them you are with them
                  </span>
                  <button
                    className={styles.closeButton}
                    onClick={() => this.setState(this.baseState)}
                  >
                    Cancel
                  </button>
                </div>

                <form
                  className={styles.supportForm}
                  onSubmit={(e) => this.submitSupport(e)}
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
            ) : null}
          </li>
        ))}
      </ul>
    );
  }
}
export default BusinessesList;
