import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';


class Trailer extends Component {


  getSaveButton = (genreSlug, movieSlug) =>{
    let buttonComponent = ''
    let allMovies = [...this.props.movies]
    let selectedMovie = allMovies.filter(movie=>movie.slug===movieSlug)[0]
    if (selectedMovie.slug === 'comingsoon'){
      buttonComponent = ''
    }
    else if(selectedMovie.saved===true){
      buttonComponent=
        <button
          className='button-nostyle save-unsave-button'
          onClick = {()=>this.props.handleSaveUnsave('unsavemovie',movieSlug, genreSlug, movieSlug)}
        >
              Unsave</button>
    }else if(selectedMovie.saved ===false){
      buttonComponent=
        <button
          className='button-nostyle save-unsave-button'
          onClick = {()=>this.props.handleSaveUnsave('savemovie',movieSlug, genreSlug, movieSlug)}
          >
              Save</button>
    }
    return buttonComponent
  }

  render() {

    return (
      <div>
      {this.props.redirect}
        {this.props.movies.filter(movie=>movie.slug===this.props.movieslug)
        .map(selection=>(
          <div
            key={'trailer-and-title-and-save'+selection.slug}
            id='trailer-and-title-and-save'>

            <iframe title={selection.name} src={selection.video} allowFullScreen></iframe>

            <div id='title-and-save-button'>
              <h2 id='trailer-title' >{selection.name} {selection.year}</h2>

              {this.getSaveButton(this.props.genreslug, this.props.movieslug)}

            </div>
          </div>
        ))}
      </div>

    );
  }
}

export default Trailer;
