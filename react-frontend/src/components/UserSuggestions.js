import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";

import './UserMovies.css';


class UserSuggestions extends Component {


  getUserMovSaveButton = (movieSlug) =>{
    let buttonComponent = ''
    let selectedMovie = this.props.movies.filter(movie=>movie.slug===movieSlug)[0]
    if(selectedMovie.saved===true){
      buttonComponent=
        <button
          onClick = {()=>this.props.handleSaveUnsave('unsavemovie', movieSlug, '','usersuggestions')}
        >
              Unsave</button>
    }else if(selectedMovie.saved ===false){
      buttonComponent=
        <button
          onClick = {()=>this.props.handleSaveUnsave('savemovie', movieSlug, '', 'usersuggestions')}
          >
              Save</button>
    }
    return buttonComponent
  }


  render() {


    let allUserSuggestionsTrailers = this.props.movies
                                      .filter(movie=>movie.username!=='crg253')
                                      .filter(film=>film.video != null)

    allUserSuggestionsTrailers.sort(this.props.compareSlug)

    let allUserSuggestionsNoTrailers = this.props.movies
                                      .filter(movie=>movie.username!=='crg253')
                                      .filter(film=>film.video === null)
                                      
    allUserSuggestionsNoTrailers.sort(this.props.compareSlug)




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
