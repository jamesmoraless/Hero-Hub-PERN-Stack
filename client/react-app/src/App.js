import Welcome from "./components/Welcome";
import Register from "./components/Register";
import Login from "./components/Login";
import AuthenticatedUserDashboard from "./components/AuthenticatedUserDashboard";
import PasswordUpdate from "./components/PasswordUpdate";
import AdminDashboard from "./components/AdminDashboard";
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
              <Route path='/passwordUpdate' component={PasswordUpdate} />
              <Route path='/admin-dashboard' component={AdminDashboard} />
          </Switch>
        </BrowserRouter> 
  );
}

export default App;
