import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
import "./index.css";
import App from "./App";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_URL,
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
