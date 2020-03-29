import React from "react";
import "./App.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MapView from "./views/MapView/MapView";
import HomeView from "./views/HomeView/HomeView";

const App = () => (
  <div className="App">
    <Router>
      <Switch>
        <Route path="/" exact component={HomeView} />
      </Switch>
    </Router>
  </div>
);

export default App;
