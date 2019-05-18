import React, { Component } from 'react';

import './User.css';

class UserMovies extends Component {

  handleUnsave = (slug) =>{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let body = JSON.stringify({slug: slug});
    this.props.handleFetch('unsavemovie', headers, body);
  }

  handleRemoveSuggestion = (slug) =>{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let body = JSON.stringify({slug: slug});
    this.props.handleFetch('removesuggestion',headers, body);
  }

  render() {
    return (
      <div style={{textAlign:"center"}}>
      <h1>{this.props.user}</h1>

      <h2>Your Suggestions</h2>
      {this.props.movies.filter(movie=>movie.username===this.props.user)
      .map(film=>
          <div key={'usersuggestion'+film.slug}>
            <h4>{film.name}</h4>
            <button
              onClick = {()=>this.handleRemoveSuggestion(film.slug)}
              >remove</button>
          </div>
          )}

      <h2>Your Saves</h2>
      {this.props.movies.filter(movie=>movie.saved===true)
      .map(film =>
      <div key={'usersaved'+film.slug}>
            <h4>{film.name}</h4>
            <button
              onClick = {()=>this.handleUnsave(film.slug)}
              >unsave</button>
      </div>
      )}

      </div>
    );
  }
}

export default UserMovies;
