import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";

import "./UserMovies.css";

class UserSuggestions extends Component {
  getSuggSaveButton = movieSlug => {
    let buttonComponent = "";
    let selectedMovie = this.props.movies.filter(
      movie => movie.slug === movieSlug
    )[0];
    if (selectedMovie.saved === true) {
      buttonComponent = (
        <button
          data-test={"user-suggestion-trailer-unsave-button-" + movieSlug}
          onClick={() =>
            this.props.handleSaveUnsave(
              "unsavemovie",
              movieSlug,
              "",
              "usersuggestions"
            )
          }
        >
          Unsave
        </button>
      );
    } else if (selectedMovie.saved === false) {
      buttonComponent = (
        <button
          data-test={"user-suggestion-trailer-save-button-" + movieSlug}
          onClick={() =>
            this.props.handleSaveUnsave(
              "savemovie",
              movieSlug,
              "",
              "usersuggestions"
            )
          }
        >
          Save
        </button>
      );
    }
    return buttonComponent;
  };

  render() {
    let allUserSuggestionsTrailers = this.props.movies
      .filter(movie => movie.recommendedBy !== "crg253")
      .filter(film => film.video != null);

    allUserSuggestionsTrailers.sort(this.props.compareTitle);

    let allUserSuggestionsNoTrailers = this.props.movies
      .filter(movie => movie.recommendedBy !== "crg253")
      .filter(film => film.video === null);

    allUserSuggestionsNoTrailers.sort(this.props.compareTitle);

    return (
      <div>
        {this.props.redirect}

        <Link to={"/"}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>

        <div data-test="user-suggested" className="all-suggested-wrapper">
          {allUserSuggestionsTrailers.map(film => (
            <div
              data-test={"user-suggestion-trailer-wrapper-" + film.slug}
              key={"usersuggestion" + film.slug}
            >
              <iframe
                data-test={"user-suggestion-trailer-" + film.slug}
                className="saved-or-suggested-video"
                title={film.title}
                src={film.video}
                allowFullScreen
              />

              <div className="saved-or-suggested-title-year">
                <p data-test={"user-suggestion-trailer-title-" + film.slug}>
                  {film.title}
                </p>
                <p
                  data-test={"user-suggestion-trailer-year-" + film.slug}
                  className="film-year-style"
                >
                  {film.year}
                </p>
              </div>
              <p
                data-test={"user-suggestion-trailer-comment-" + film.slug}
                className="suggested-by-title"
              >
                Suggested by {film.recommendedBy}
              </p>
              <div className="save-unsave-or-unsuggest-button-wrapper">
                {this.getSuggSaveButton(film.slug)}
              </div>
            </div>
          ))}

          {allUserSuggestionsNoTrailers.map(film => (
            <div
              data-test={"user-suggestion-card-wrapper-" + film.slug}
              key={"usersuggestion" + film.slug}
            >
              <div
                data-test={"user-suggestion-card-" + film.slug}
                className="suggested-movie-tile"
              >
                <p className="tile-title-style">Coming</p>
                <p>Soon</p>
              </div>

              <div className="saved-or-suggested-title-year">
                <p data-test={"user-suggestion-card-title-" + film.slug}>
                  {film.title}
                </p>
                <p
                  data-test={"user-suggestion-card-year-" + film.slug}
                  className="film-year-style"
                >
                  {film.year}
                </p>
              </div>
              <p
                data-test={"user-suggestion-card-comment-" + film.slug}
                className="suggested-by-title"
              >
                Suggested by {film.recommendedBy}
              </p>
            </div>
          ))}
        </div>
        <div className="user-movies-footer" />
      </div>
    );
  }
}

export default UserSuggestions;
