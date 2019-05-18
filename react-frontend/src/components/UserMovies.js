import React, { Component } from 'react';

import './User.css';

class UserMovies extends Component {


  render() {
    return (
      <div style={{textAlign:"center"}}>
      <h1>{this.props.user}</h1>
      <h2>Your Suggestions</h2>
      {this.props.movies.filter(movie=>movie.username===this.props.user)
      .map(film=><h4>{film.name}</h4>)}
      <h2>Your Saves</h2>
      {this.props.movies.filter(movie=>movie.saved===true)
      .map(film=><h4>{film.name}</h4>)}

      </div>
    );
  }
}

export default UserMovies;
