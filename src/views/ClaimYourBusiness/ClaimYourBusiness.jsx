import React from "react";

import Airtable from "airtable";

import styles from "./ClaimYourBusiness.module.scss";

import Button from "../../components/Button/Button";

const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_KEY }).base(
  "app7LKgKsFtsq1x8D"
);

class ClaimYourBusiness extends React.Component {
  state = {
    email: "",
    phoneNumber: null,
    gofundmeURL: null,
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
      base("Table 1").create(
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
          <h1>Claim "{this.state.placeName}"</h1>
          <span>Tell people how to support what you are doing</span>
        </header>
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
                onChange={(e) => {
                  this.setState({ email: e.target.value });
                }}
              />
            </div>
            <div className={styles.formItem}>
              <label htmlFor="email">Email address</label>
              <input
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
              <label htmlFor="gofundme">GoFundMe link</label>
              <input
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
            <div className={styles.formItem}>
              <label htmlFor="phone">Phone number</label>
              <input
                type="text"
                name="phone"
                placeholder="eg. 789 987 788"
                id="phone"
                value={this.state.phoneNumber}
                onChange={(e) => {
                  this.setState({ phoneNumber: e.target.value });
                }}
              />
            </div>

            <Button type="submit">Verificate</Button>
          </div>
        </form>
        {this.state.status && this.state.status === "sent" ? (
          <div className={styles.statusWrapper}>
            <span>Sent to the verification</span>
          </div>
        ) : null}
      </main>
    );
  }
}
export default ClaimYourBusiness;
