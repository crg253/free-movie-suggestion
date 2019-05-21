import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';

import './User.css';

class UserMovies extends Component {


  handleRemoveSuggestion = (slug) =>{
    fetch('api/removesuggestion',{
      method:'POST',
      headers:{
         'Authorization':"Bearer " +localStorage.getItem('token'),
         'Content-Type':'application/json'
       },
      body: JSON.stringify({slug:slug})
    })
    .then(res=>{
    if (res.status===401) {
      res.json()
       .then(res=>{
         this.props.setUser(res.user)
         this.props.setMovies(res.movies)
         this.props.setRedirect(<Redirect to='signin'/>)
         this.props.setRedirectBackSlug('usermovies')
      })
    }
    else if (res.status===200){
      res.json()
        .then(res=>{
          this.props.setUser(res.user)
          this.props.setMovies(res.movies)
       })
     }
    })
  }


  render() {
    return (
      <div style={{textAlign:"center"}}>
      {this.props.redirect}

      <Link to={'/'}>
        <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
      </Link>
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
              onClick = {()=>this.props.handleSaveUnsave('unsavemovie',film.slug)}
              >unsave</button>
      </div>
      )}

      </div>
    );
  }
}

export default UserMovies;
