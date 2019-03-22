import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import AppProvider from "./components/AppProvider";
import Home from "./components/Home";
import MovieList from "./components/MovieList";
import Error from "./components/Error";

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/' component={Home} exact />
            <Route
              path='/movielist'
              render={(props)=> <AppProvider {...props}><MovieList/></AppProvider>}/>
            <Route component = {Error} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
