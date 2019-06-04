import React, { Component } from 'react';
import { Link } from "react-router-dom";

class UserSuggestions extends Component {

  render() {
    return (
      <div>
        <Link to={'/'}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>

        <div style={{textAlign:'center'}}>
          <h1>User Suggestions</h1>
          {this.props.movies.filter(movie=>movie.status === 'pending')
          .map(film=>
            <div style={{display:'flex', justifyContent:'center'}}>
            <p>{film.name}</p>
            <p style={{marginLeft:'5px'}}>{film.year}</p>
            <p style={{marginLeft:'5px'}}>{film.username}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default UserSuggestions;
