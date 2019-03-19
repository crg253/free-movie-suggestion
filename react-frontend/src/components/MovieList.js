import React, { Component } from 'react';
import axios from 'axios';


class movielist extends Component {
  state = {
    Movies:[]
  }

  componentDidMount(){
    axios.get('http://127.0.0.1:5000/movies')
      .then(response => {
        this.setState({Movies: response.data});
      });
  }

  render() {
    let movieTitles = this.state.Movies.map(movie =>(
      <p>{movie.name}</p>
    ))

    return (
      <div>
        {movieTitles}
      </div>
    );
  }
}

export default movielist;
