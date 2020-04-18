import React from "react";

import Airtable from "airtable";
import { Link } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "../../assets/arrow-left.svg";

import styles from "./ClaimYourBusiness.module.scss";

import Button from "../../components/Button/Button";

const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_KEY }).base(
  process.env.REACT_APP_AIRTABLE_BASE
);

class ClaimYourBusiness extends React.Component {
  state = {
    email: "",
    phoneNumber: this.props.location.state.phoneNumber,
    gofundmeURL: "",
    placeId: this.props.location.state.placeId,
    placeName: this.props.location.state.placeName,
    status: null,
  };

  componentDidMount() {}

  createRecordAirtable = (
    placeId,
    gofundmeURL,
    placeName,
    email,
    phoneNumber,
    isVerified
  ) => {
    return new Promise((resolve, reject) => {
      base(process.env.REACT_APP_AIRTABLE_CLAIM_BUSINESS_TABLE).create(
        [
          {
            fields: {
              google_places_id: placeId,
              gofundme_url: gofundmeURL,
              place_name: placeName,
              email,
              phone_number: phoneNumber,
              is_verified: isVerified,
            },
          },
        ],
        function (err, records) {
          if (err) reject(err);
          if (records.length === 1) resolve(records);
        }
      );
    });
  };

  sendToAirtable = (e) => {
    e.preventDefault();
    const { email, phoneNumber, gofundmeURL, placeId, placeName } = this.state;
    e.preventDefault();
    this.createRecordAirtable(
      placeId,
      gofundmeURL,
      placeName,
      email,
      phoneNumber,
      false
    )
      .then((data) => {
        if (data) this.setState({ status: "sent" });
      })
      .catch(() => this.setState({ status: "error" }));
  };

  render() {
    return (
      <main className={styles.siteWrapper}>
        <header className={styles.mainHeader}>
          <Link to="/" className={styles.backLink}>
            <ArrowLeft /> Back
          </Link>
          <h1>Claim "{this.state.placeName}"</h1>
          <span>Tell people how to support what you are doing</span>
          <h2>How it works?</h2>
          <p>
            We use the phone number provided in your Google Place console to
            verify if you are the owner of the {this.state.placeName}. You will
            recive the text with a verification code that must be provided here.
          </p>
        </header>
        <section>
          <form onSubmit={this.sendToAirtable} className={styles.formWrapper}>
            <div className={styles.formWrapperInner}>
              <div className={styles.formItemDisabled}>
                <label htmlFor="placename">Place name</label>
                <input
                  type="text"
                  name="placename"
                  id="placename"
                  value={this.state.placeName}
                  disabled
                />
              </div>
              <div className={styles.formItemDisabled}>
                <label htmlFor="phonenumber">Phone number</label>
                <input
                  type="text"
                  name="phonenumber"
                  id="phonenumber"
                  value={this.state.phoneNumber}
                  disabled
                />
              </div>
              <div className={styles.formItem}>
                <label htmlFor="email">Email address</label>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="eg. john.doe@gmail.com"
                  id="email"
                  value={this.state.email}
                  onChange={(e) => {
                    this.setState({ email: e.target.value });
                  }}
                />
              </div>
              <div className={styles.formItem}>
                <label htmlFor="gofundme">
                  GoFundMe or other fundraising link
                </label>
                <input
                  required
                  type="text"
                  name="gofundme"
                  id="gofundme"
                  placeholder="eg. https://gofundme.com/f/mycoolproject"
                  value={this.state.gofundmeURL}
                  onChange={(e) => {
                    this.setState({ gofundmeURL: e.target.value });
                  }}
                />
              </div>

              <Button type="submit">Verify</Button>
            </div>
          </form>
        </section>
        {this.state.status && this.state.status === "sent" ? (
          <div className={styles.statusWrapper}>
            <span>Check your email for verification</span>
          </div>
        ) : null}
      </main>
    );
  }
}
export default ClaimYourBusiness;
