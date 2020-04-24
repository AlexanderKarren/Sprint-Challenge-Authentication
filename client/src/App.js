import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Users from './components/Users';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/users"><Users /></Route>
        <Route path="/register"><Register /></Route>
        <Route path="/"><Login /></Route>
      </Switch>
    </div>
  );
}

export default App;
