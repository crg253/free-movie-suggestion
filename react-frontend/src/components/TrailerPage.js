import React, {Component} from "react";
import {Link} from "react-router-dom";

import "./TrailerPage.css";
import Trailer from "./Trailer";
import GenreSelector from "./GenreSelector";
import MovieList from "./MovieList";

class TrailerPage extends Component {
  render() {
    window.scrollTo(0, 0);
    let genreslug = this.props.match.params.genreslug;
    let upperGenre = this.props.changeGenreCase("toUpper", genreslug);

    return (
      <div>
        <Link to={"/"}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>

        <div id="trailer-and-genres-and-list">
          <Trailer
            movieslug={this.props.match.params.movieslug}
            genreslug={genreslug}
            movies={this.props.movies}
            handleSaveUnsave={this.props.handleSaveUnsave}
            redirect={this.props.redirect}
          />

          <div id="genres-and-list">
            <GenreSelector
              getRandomMovies={this.props.getRandomMovies}
              upperGenre={upperGenre}
              changeGenreCase={this.props.changeGenreCase}
              setSort={this.props.setSort}
              sortBy={this.props.sortBy}
              scrollGenres={this.props.scrollGenres}
              setIndexes={this.props.setIndexes}
              indexUp={this.props.indexUp}
              indexDown={this.props.indexDown}
              subtractGenreIndex={this.props.subtractGenreIndex}
              addGenreIndex={this.props.addGenreIndex}
            />
            <MovieList
              movies={this.props.movies}
              genreslug={genreslug}
              upperGenre={upperGenre}
              sortBy={this.props.sortBy}
              compareTitle={this.props.compareTitle}
              compareYear={this.props.compareYear}
            />
          </div>
        </div>
        <div id="trailer-page-footer" />
      </div>
    );
  }
}

export default TrailerPage;
