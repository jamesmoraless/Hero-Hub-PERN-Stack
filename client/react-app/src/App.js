import Welcome from "./components/Welcome";
import Register from "./components/Register";
import Login from "./components/Login";
import AuthenticatedUserDashboard from "./components/AuthenticatedUserDashboard";
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
          <Switch>
              <Route exact path='/' component={Welcome} />
              <Route exact path='/register' component={Register} />
              <Route path='/login' component={Login} />
              <Route path='/authenticated-dashboard' component={AuthenticatedUserDashboard} />
          </Switch>
        </BrowserRouter> 
  );
}

export default App;
