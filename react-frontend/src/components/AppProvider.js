import React, { Component } from 'react';

import GenreList from "./GenreList";
import SavedList from "./SavedList";
import CompleteList from "./CompleteList";


class AppProvider extends Component {


  render() {

    
    let selectionComponent = null;
    switch(this.state.SelectBy){
      case("All"):
        selectionComponent = <CompleteList/>
        console.log("Complete List selected");
        break;
      case("Saved"):
        selectionComponent = <SavedList/>
        console.log("Saved List selected");
        break;
      default:
        selectionComponent =<GenreList/>
        console.log("Genre List selected");
    }

    return (
    );
  }
}

export default AppProvider;
