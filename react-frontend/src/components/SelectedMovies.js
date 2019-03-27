import React, {Component} from 'react';

import AppContext from "./AppContext";

class SelectedMovies extends Component {
    render(){

      return (
        <AppContext.Consumer>
        {(context) => context.selectionComponent}
        </AppContext.Consumer>
      );
    }
}

export default SelectedMovies;
