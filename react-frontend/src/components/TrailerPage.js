import React, { Component } from 'react';
import { Link } from "react-router-dom";

import './TrailerPage.css';
import Trailer from './Trailer';
import Genres from './Genres';
import MovieList from './MovieList';

class TrailerPage extends Component {

  render() {

    window.scrollTo(0, 0);
    let genreslug= this.props.match.params.genreslug
    let upperGenre = this.props.changeGenreCase('toUpper',genreslug)
    //console.log(genreslug)
    //console.log(upperGenre);

    return (
      <div>
        <Link to={'/'}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>

        <div id="trailer-and-genres-and-list">
          <Trailer
              movieslug={this.props.match.params.movieslug}
              genreslug={genreslug}
              movies={this.props.movies}
              redirect = {this.props.redirect}
              handleSaveUnsave={this.props.handleSaveUnsave}
          />

          <div id="genres-and-list">
            <Genres
                  genreslug= {genreslug}
                  upperGenre={upperGenre}
                  changeGenreCase={this.props.changeGenreCase}
                  setSort={this.props.setSort}
                  sortBy={this.props.sortBy}
                  scrollGenres={this.props.scrollGenres}
                  getRandomMovies={this.props.getRandomMovies}
                  user={this.props.user}
                  movies={this.props.movies}
                  genreIndex={this.props.genreIndex}
                  indexUp={this.props.indexUp}
                  indexDown={this.props.indexDown}
                  subtractGenreIndex={this.props.subtractGenreIndex}
                  addGenreIndex={this.props.addGenreIndex}
                  setIndexes={this.props.setIndexes}
            />
            <MovieList
                  genreslug= {genreslug}
                  upperGenre={upperGenre}
                  movies={this.props.movies}
                  sortBy={this.props.sortBy}
                  handleSaveUnsave={this.props.handleSaveUnsave}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TrailerPage;
