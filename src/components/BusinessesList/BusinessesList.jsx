import React, { Component } from "react";
import { Link } from "react-router-dom";
import Airtable from "airtable";
import { CaptchaConsumer } from "../../contexts/CaptchaContext";
import styles from "./BusinessesList.module.scss";
import Button from "../Button/Button";

import { SHOW_IMAGES } from "../../constants";

const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_KEY }).base(
  "app7LKgKsFtsq1x8D"
);

class BusinessesList extends Component {
  state = { activePlace: null, emailAddress: "", sendEmailStatus: "" };

  baseState = this.state;

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activePlace !== this.state.activePlace) {
      this.props.getActivePlace(this.state.activePlace);
    }
  }

  handleShowYourSupport = (place) => {
    this.setState({
      activePlace: { ...place },
    });
  };

  createRecordAirtable = (place_id, place_name, email) => {
    return new Promise((resolve, reject) => {
      base(process.env.REACT_APP_AIRTABLE_WAITING_LIST_TABLE).create(
        [
          {
            fields: {
              placeName: place_name,
              placeId: place_id,
              email,
            },
          },
        ],
        (err, records) => {
          if (err) reject(err);
          if (records.length === 1) resolve(records);
        }
      );
    });
  };

  submitSupport = (e) => {
    e.preventDefault();
    const { activePlace, emailAddress } = this.state;
    this.setState({ sendEmailStatus: "loading" });
    this.createRecordAirtable(
      activePlace.place_id,
      activePlace.name,
      emailAddress
    )
      .then((data) => {
        if (data)
          this.setState({
            sendEmailStatus: "sent",
            activePlace: null,
            emailAddress: "",
          });
      })
      .catch(() => this.setState({ sendEmailStatus: "error" }));
  };

  render() {
    const getPhoto = (photo) => {
      return SHOW_IMAGES ? { backgroundImage: `url(${photo()})` } : {};
    };

    const { listOfPlaces } = this.props;
    return (
      <CaptchaConsumer>
        {(context) => (
          <div className="business-tile">
            {listOfPlaces.map((placeObject) => (
              <div
                className={styles.listElement}
                key={placeObject.place.place_id}
              >
                <div
                  className={styles.image}
                  style={
                    placeObject.place.photos
                      ? getPhoto(placeObject.place.photos[0].getUrl)
                      : null
                  }
                />
                <div className={styles.listElementContent}>
                  <h3>{placeObject.place.name}</h3>
                  <span className={styles.listElementContentAddress}>
                    {placeObject.place.vicinity ||
                      placeObject.place.formatted_address}
                  </span>
                </div>
                <div className={styles.buttonWrapper}>
                  {placeObject.gofundmeURL ? (
                    <Button href={placeObject.gofundmeURL}>Donate</Button>
                  ) : (
                    <Button
                      onClick={() => {
                        this.handleShowYourSupport(placeObject.place);
                        context.captcha.current.execute();
                      }}
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
                        type="submit"
                        onClick={() => this.setState(this.baseState)}
                      >
                        Cancel
                      </button>
                    </div>

                    <form
                      className={styles.supportForm}
                      onSubmit={this.submitSupport}
                    >
                      <label className={styles.supportFormLabel}>
                        <span className={styles.supportFormLabelText}>
                          Privide an email address to get information how you
                          can help this business to survive
                        </span>
                        <input
                          value={this.state.emailAddress}
                          onChange={(event) => {
                            this.setState({ emailAddress: event.target.value });
                          }}
                          name="email"
                          className={styles.supportFormInput}
                          placeholder="eg. john.doe@gmail.com"
                          type="email"
                          required
                        />
                      </label>
                      <Button type="submit">Send</Button>
                    </form>
                    {this.state.sendEmailStatus === "loading" && (
                      <span className={styles.emailIndicator}>Sending...</span>
                    )}
                    <Link
                      className={styles.linkToClaim}
                      to={{
                        pathname: "claim-business",
                        state: {
                          placeId: this.state.activePlace.place_id,
                          placeName: this.state.activePlace.name,
                        },
                      }}
                      name="email"
                      className={styles.supportFormInput}
                      placeholder="eg. john.doe@gmail.com"
                      type="email"
                      required
                    />
                  </label>
                  <Button type="submit">Send</Button>
                </form>
                {this.state.sendEmailStatus === "loading" && (
                  <span className={styles.emailIndicator}>Sending...</span>
                )}
                <Link
                  className={styles.linkToClaim}
                  to={`claim-business/${this.state.activePlace.place_id}`}
                >
                  Is that your business? Claim it!
                </Link>

                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </CaptchaConsumer>
    );
  }
}
export default BusinessesList;
