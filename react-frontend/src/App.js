import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import MovieList from "./components/MovieList";
import Error from "./components/Error";

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/:movieslug' component={MovieList}/>
          <Route component = {Error} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
