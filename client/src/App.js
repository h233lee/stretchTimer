import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Login.js';
import Timer from './Timer.js';
import './App.scss';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/timer" component={Timer} />
      </Switch>
    </Router>
  );
};

export default App;
