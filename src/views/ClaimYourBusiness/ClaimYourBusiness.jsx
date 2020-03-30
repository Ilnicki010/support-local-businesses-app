import React from "react";
import qs from "qs";
import Airtable from "airtable";

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
      <main>
        <h1>Claim {this.state.placeName}</h1>
        <span>Tell people how to support what you are doing</span>
        <form onSubmit={this.sendToAirtable}>
          <label htmlFor="email">Provide your email address</label>
          <input
            type="email"
            name="email"
            id="email"
            value={this.state.email}
            onChange={(e) => {
              this.setState({ email: e.target.value });
            }}
          />
          <label htmlFor="gofundme">Provide GoFundMe link</label>
          <input
            type="text"
            name="gofundme"
            id="gofundme"
            value={this.state.gofundmeURL}
            onChange={(e) => {
              this.setState({ gofundmeURL: e.target.value });
            }}
          />
          <label htmlFor="phone">Provide your phone number</label>
          <input
            type="text"
            name="phone"
            id="phone"
            value={this.state.phoneNumber}
            onChange={(e) => {
              this.setState({ phoneNumber: e.target.value });
            }}
          />

          <Button type="submit">Send</Button>
        </form>
        {this.state.status && this.state.status === "sent" ? (
          <span>Sent!</span>
        ) : null}
      </main>
    );
  }
}
export default ClaimYourBusiness;
