import React from "react";
import "./App.css";

import MapView from "./views/MapView/MapView";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => (
  <div className="App">
    <Router>
      <Switch>
        <Route path="/" exact component={MapView} />
      </Switch>
    </Router>
  </div>
);

export default App;
