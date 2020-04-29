import React from "react";
import "./App.css";
import ReCAPTCHA from "react-google-recaptcha";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ClaimYourBusiness from "./views/ClaimYourBusiness/ClaimYourBusiness";
import HomeView from "./views/HomeView/HomeView";
import { CaptchaProvider } from "./contexts/CaptchaContext";

const App = () => {
  const captchaRef = React.createRef();
  return (
    <div className="App">
      <CaptchaProvider value={{ captcha: captchaRef }}>
        <Router>
          <Switch>
            <Route path="/claim-business" exact component={ClaimYourBusiness} />
            <Route path="/" exact component={HomeView} />
          </Switch>
        </Router>
      </CaptchaProvider>
      <ReCAPTCHA
        size="invisible"
        ref={captchaRef}
        sitekey={process.env.REACT_APP_CAPTCHA_KEY}
      />
    </div>
  );
};

export default App;
