import Welcome from "./components/Welcome";
import Register from "./components/Register";
import Login from "./components/Login";
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, Router } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
          <Switch>
              <Route exact path='/' component={Welcome} />
              <Route exact path='/register' component={Register} />
              <Route path='/login' component={Login} />
          </Switch>
        </BrowserRouter> 
  );
}

export default App;
