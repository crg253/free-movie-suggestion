import React, {Component} from 'react';

import AppContext from "./AppContext";

class SelectedMovies extends Component {
    // use hooks and state to determine the component
    render(){
      return (
        <AppContext.Consumer>
        {(context) => context.selectionComponent}
        </AppContext.Consumer>
      );
    }
}

export default SelectedMovies;
