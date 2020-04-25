import React from "react";
import "./App.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ClaimYourBusiness from "./views/ClaimYourBusiness/ClaimYourBusiness";
import HomeView from "./views/HomeView/HomeView";

const App = () => (
  <div className="App">
    <Router>
      <Switch>
        <Route
          path="/claim-business/:placeId"
          exact
          component={ClaimYourBusiness}
        />
        <Route path="/" exact component={HomeView} />
      </Switch>
    </Router>
  </div>
);

export default App;
