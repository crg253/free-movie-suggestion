import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';

import './UserMovies.css';

class UserMovies extends Component {


  handleRemoveSuggestion = (slug) =>{
    fetch('/api/removesuggestion',{
      method:'POST',
      headers:{
         'Authorization':'Bearer ' +localStorage.getItem('token'),
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
         this.props.setRedirectBack('')
         this.props.setRedirectBackSlug('usermovies')
         this.props.setRedirect(<Redirect to='/signin'/>)
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


    let userSaves = this.props.movies.filter(movie=>movie.saved===true)
    userSaves.sort(this.props.compareSlug)

    let userSuggestionsTrailers = this.props.movies
                    .filter(movie=>movie.username===this.props.user)
                    .filter(film=>film.video != null)
    userSuggestionsTrailers.sort(this.props.compareSlug)

    let userSuggestionsNoTrailers = this.props.movies
                    .filter(movie=>movie.username===this.props.user)
                    .filter(film=>film.video === null)
    userSuggestionsNoTrailers.sort(this.props.compareSlug)

    return (
      <div >
        {this.props.redirect}

        <Link to={'/'}>
          <h1 id='main-title'>FREE MOVIE SUGGESTION</h1>
        </Link>

        <h2 className='user-movies-title'>Your Saved Movies</h2>
        <div id='saved-movies-wrapper'>
          {userSaves.map(film=>
            <div key={'usersave'+film.slug}>
                <iframe className='saved-or-suggested-video'
                        title={film.name}
                        src={film.video}
                        allowFullScreen
                >
                </iframe>
                <div className='saved-or-suggested-title-year'>
                  <p>{film.name}</p>
                  <p className='film-year-style'>{film.year}</p>
                </div>
                <div className='save-unsave-or-unsuggest-button-wrapper'>
                  <button
                    onClick={()=>this.props.handleSaveUnsave('unsavemovie',film.slug,'','usermovies')}
                  >
                  unsave
                  </button>
                </div>
            </div>
          )}
      </div>

        <h2 className='user-movies-title'>Your Suggestions</h2>

        <div className='all-suggested-wrapper'>
          {userSuggestionsTrailers.map(film=>
            <div key={'usersuggestion'+film.slug}>
                <iframe
                    className='saved-or-suggested-video'
                    title={film.name}
                    src={film.video}
                    allowFullScreen></iframe>
                <div className='saved-or-suggested-title-year'>
                  <p>{film.name}</p>
                  <p className='film-year-style'>{film.year}</p>
                </div>
                <div className='save-unsave-or-unsuggest-button-wrapper'>
                  <button
                    onClick={()=>this.handleRemoveSuggestion(film.slug)}
                  >
                  unsuggest
                  </button>
                </div>
            </div>
          )}

          {userSuggestionsNoTrailers.map(film=>
            <div key={'usersuggestion'+film.slug}>
                <div className='suggested-movie-tile'>
                  <p id='tile-title-style'>Coming</p>
                  <p>Soon</p>
                </div>

                <div className='saved-or-suggested-title-year'>
                  <p>{film.name}</p>
                  <p className='film-year-style'>{film.year}</p>
                </div>
                <div className='save-unsave-or-unsuggest-button-wrapper'>
                  <button
                    onClick={()=>this.handleRemoveSuggestion(film.slug)}
                  >
                  unsuggest
                  </button>
                </div>
            </div>
          )}
        </div>
        <div className='footer'></div>

      </div>
    );
  }
}

export default UserMovies;
