import React, { Component } from 'react';
import AppContext from "./AppContext";
import axios from 'axios';

class AppProvider extends Component {
  state = {
    Movies:[],
    Genres:[]
    }

    componentDidMount(){
        axios.get('http://127.0.0.1:5000/movies')
        .then(response=> {
          this.setState({Movies: response.data})
        })
        axios.get('http://127.0.0.1:5000/genres')
        .then(response=> {
          this.setState({Genres: response.data})
        })
      }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppProvider;
