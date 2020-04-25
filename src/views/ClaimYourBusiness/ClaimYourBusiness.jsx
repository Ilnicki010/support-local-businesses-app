import React, { useState, useEffect } from "react";
import ReactDependentScript from "react-dependent-script";
import Airtable from "airtable";
import { Link, useParams } from "react-router-dom";
import useScript from "../../hooks/useScript";

import { ReactComponent as ArrowLeft } from "../../assets/arrow-left.svg";

import styles from "./ClaimYourBusiness.module.scss";

import Button from "../../components/Button/Button";

const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_KEY }).base(
  process.env.REACT_APP_AIRTABLE_BASE
);

function ClaimYourBusiness() {
  const { placeId: placeIdParam } = useParams();
  const [mapsLoaded, mapsError] = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`
  );
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gofundmeURL, setGofundmeURL] = useState("");
  const [placeId, setPlaceId] = useState(placeIdParam);
  const [placeName, setPlaceName] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (mapsLoaded && !mapsError) {
      let service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
      service.getDetails(
        {
          placeId,
          fields: ["international_phone_number", "name"],
        },
        (data, googleStatus) => {
          if (googleStatus === "OK") {
            setPhoneNumber(data.international_phone_number);
            setPlaceName(data.name);
          }
        }
      );

      return () => {
        service = null;
      };
    }
  }, [mapsLoaded]);

  const createRecordAirtable = (
    placeIdAirtable,
    gofundmeURLAiratble,
    placeNameAirtable,
    emailAirtable,
    phoneNumberAirtable,
    isVerifiedAirtable
  ) => {
    return new Promise((resolve, reject) => {
      base(process.env.REACT_APP_AIRTABLE_CLAIM_BUSINESS_TABLE).create(
        [
          {
            fields: {
              google_places_id: placeIdAirtable,
              gofundme_url: gofundmeURLAiratble,
              place_name: placeNameAirtable,
              email: emailAirtable,
              phone_number: phoneNumberAirtable,
              is_verified: isVerifiedAirtable,
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

  const sendToAirtable = (e) => {
    e.preventDefault();
    createRecordAirtable(
      placeId,
      gofundmeURL,
      placeName,
      email,
      phoneNumber,
      false
    )
      .then((data) => {
        if (data) setStatus("sent");
      })
      .catch(() => setStatus("error"));
  };

  return (
    <main className={styles.siteWrapper}>
      <header className={styles.mainHeader}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft /> Back
        </Link>
        <h1>Claim "{placeName}"</h1>
        <span>Tell people how to support what you are doing</span>
        <h2>How it works?</h2>
        <p>
          We use the phone number provided in your Google Place console to
          verify if you are the owner of the {placeName}. You will recive the
          text with a verification code that must be provided here.
        </p>
      </header>
      <section>
        <form onSubmit={sendToAirtable} className={styles.formWrapper}>
          <div className={styles.formWrapperInner}>
            <div className={styles.formItemDisabled}>
              <label htmlFor="placename">Place name</label>
              <input
                type="text"
                name="placename"
                id="placename"
                value={placeName}
                disabled
              />
            </div>
            <div className={styles.formItemDisabled}>
              <label htmlFor="phonenumber">Phone number</label>
              <input
                type="text"
                name="phonenumber"
                id="phonenumber"
                value={phoneNumber}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={gofundmeURL}
                onChange={(e) => setGofundmeURL(e.target.value)}
              />
            </div>

            <Button type="submit">Verify</Button>
          </div>
        </form>
      </section>
      {status && status === "sent" ? (
        <div className={styles.statusWrapper}>
          <span>Check your email for verification</span>
        </div>
      ) : null}
    </main>
  );
}
export default ClaimYourBusiness;
