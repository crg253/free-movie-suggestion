import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";

import './UserMovies.css';


class UserSuggestions extends Component {


  handleSaveUnsaveUserMov = (saveunsave, slug) =>{
    fetch('/api/'.concat(saveunsave),{
      method:'POST',
      headers:{
         'Authorization':"Bearer " +localStorage.getItem('token'),
         'Content-Type':'application/json'
       },
      body: JSON.stringify({slug: slug})
    })
    .then(res=>{
      if (res.status===401) {
        res.json()
         .then(res=>{
           this.props.setUser(res.user)
           this.props.setMovies(res.movies)
           this.props.setRedirectBack('')
           this.props.setRedirectBackSlug('usersuggestions')
           this.props.setRedirect(<Redirect to='/signin'/>)
          })
      }else if (res.status===200){
        res.json()
        .then(res=>{
          this.props.setUser(res.user)
          this.props.setMovies(res.movies)
         })
      }
    })
  }

  getUserMovSaveButton = (movieSlug) =>{
    let buttonComponent = ''
    let selectedMovie = this.props.movies.filter(movie=>movie.slug===movieSlug)[0]
    if(selectedMovie.saved===true){
      buttonComponent=
        <button
          onClick = {()=>this.handleSaveUnsaveUserMov('unsavemovie', movieSlug)}
        >
              Unsave</button>
    }else if(selectedMovie.saved ===false){
      buttonComponent=
        <button
          onClick = {()=>this.handleSaveUnsaveUserMov('savemovie', movieSlug)}
          >
              Save</button>
    }
    return buttonComponent
  }

  render() {

    function dropThe(slug) {
      if (slug.slice(0,3)==="the"){
        return slug.slice(3,)
      }else{
        return slug
      }
    }

    function compareSlug(a,b) {
    if (dropThe(a.slug) < dropThe(b.slug))
      return -1;
    if (dropThe(a.slug) > dropThe(b.slug))
      return 1;
    return 0;
    }

    let allUserSuggestionsTrailers = this.props.movies
                    .filter(movie=>movie.username!=='crg253')
                    .filter(film=>film.video != null)
    allUserSuggestionsTrailers.sort(compareSlug)

    let allUserSuggestionsNoTrailers = this.props.movies
                    .filter(movie=>movie.username!=='crg253')
                    .filter(film=>film.video === null)
    allUserSuggestionsNoTrailers.sort(compareSlug)




    return (
      <div>
        {this.props.redirect}

        <Link to={'/'}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>

        <div className="all-suggested-wrapper">
          {allUserSuggestionsTrailers.map(film=>
            <div
              key={'usersuggestion'+film.slug}
              >
                <iframe
                    className='saved-or-suggested-video'
                    title={film.name}
                    src={film.video}
                    allowFullScreen></iframe>

                <div className='saved-or-suggested-title-year'>
                  <p>{film.name}</p>
                  <p className='film-year-style'>{film.year}</p>
                </div>
                <p className='suggested-by-title'>suggested by {film.username}</p>
                <div className='save-unsave-or-unsuggest-button-wrapper'>
                  {this.getUserMovSaveButton(film.slug)}
                </div>
            </div>
            )}

            {allUserSuggestionsNoTrailers.map(film=>
              <div key={'usersuggestion'+film.slug}>
                  <div className='suggested-movie-tile'>
                    <p className='tile-title-style'>Coming</p>
                    <p>Soon</p>
                  </div>

                  <div className='saved-or-suggested-title-year'>
                    <p>{film.name}</p>
                    <p className='film-year-style'>{film.year}</p>
                  </div>
                  <p className='suggested-by-title'>suggested by {film.username}</p>
              </div>
              )}
        </div>
        <div className='footer'></div>

      </div>
    );
  }
}

export default UserSuggestions;
