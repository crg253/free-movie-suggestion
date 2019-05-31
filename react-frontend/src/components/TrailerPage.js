import React, { Component } from 'react';
import { Link } from "react-router-dom";

import './TrailerPage.css';
import Trailer from './Trailer';
import Genres from './Genres';
import MovieList from './MovieList';

class TrailerPage extends Component {

  componentDidMount(){
    this.props.setLastMovie(this.props.match.params.movieslug)
  }

  render() {

    window.scrollTo(0, 0);


    return (
      <div>
        <Link to={'/'}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>

        <div id="trailer-and-genres-and-list">
          <Trailer
              movieslug={this.props.match.params.movieslug}
              movies={this.props.movies}
              redirect = {this.props.redirect}
              handleSaveUnsave={this.props.handleSaveUnsave}/>

          <div id="genres-and-list">
            <Genres
                  setSort={this.props.setSort}
                  sortBy={this.props.sortBy}
                  scrollGenres={this.props.scrollGenres}
                  chooseListBy={this.props.chooseListBy}
                  listBy={this.props.listBy}
                  getRandomMovies={this.props.getRandomMovies}
                  setLastMovie = {this.props.setLastMovie}
                  user={this.props.user}
                  movies={this.props.movies}
                  genreIndex={this.props.genreIndex}
                  indexUp={this.props.indexUp}
                  indexDown={this.props.indexDown}
                  subtractGenreIndex={this.props.subtractGenreIndex}
                  addGenreIndex={this.props.addGenreIndex}
                  setIndexes={this.props.setIndexes}/>
            <MovieList
                  movies={this.props.movies}
                  sortBy={this.props.sortBy}
                  listBy={this.props.listBy}
                  handleSaveUnsave={this.props.handleSaveUnsave}
                  setLastMovie = {this.props.setLastMovie}/>
          </div>
        </div>
      </div>
    );
  }
}

export default TrailerPage;
