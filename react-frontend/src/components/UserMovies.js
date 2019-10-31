import React, {Component} from "react";
import {Redirect, Link} from "react-router-dom";

import "./UserMovies.css";

class UserMovies extends Component {
  handleRemoveSuggestion = slug => {
    fetch("/api/removesuggestion", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({slug: slug})
    }).then(res => {
      this.props.handleGetAndSetUserAndMovies(localStorage.getItem("token"));
      if (res.status === 401) {
        this.props.setRedirectBack("");
        this.props.setRedirectBackSlug("usermovies");
        this.props.setRedirect(<Redirect to="/signin" />);
      }
      if (res.status === 500) {
        window.location.reload(true);
      }
    });
  };

  render() {
    let userSaves = this.props.movies.filter(movie => movie.saved === true);
    userSaves.sort(this.props.compareTitle);

    let userSuggestionsTrailers = this.props.movies
      .filter(movie => movie.recommendedBy === this.props.user.name)
      .filter(film => film.video != null);
    userSuggestionsTrailers.sort(this.props.compareTitle);

    let userSuggestionsNoTrailers = this.props.movies
      .filter(movie => movie.recommendedBy === this.props.user.name)
      .filter(film => film.video === null);
    userSuggestionsNoTrailers.sort(this.props.compareTitle);

    return (
      <div data-test="user-movies-full-page-wrapper">
        {this.props.redirect}

        <Link to={"/"}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>

        <h2 className="user-movies-title">Your Saved Movies</h2>
        <div data-test="saved-movies" id="saved-movies-wrapper">
          {userSaves.map(film => (
            <div
              data-test={"saved-trailer-wrapper-" + film.slug}
              key={"usersave" + film.slug}
            >
              <iframe
                data-test={"saved-trailer-" + film.slug}
                className="saved-or-suggested-video"
                title={film.title}
                src={film.video}
                allowFullScreen
              />

              <div className="saved-or-suggested-title-year">
                <p data-test={"saved-title-" + film.slug}>{film.title}</p>
                <p
                  data-test={"saved-year-" + film.slug}
                  className="film-year-style"
                >
                  {film.year}
                </p>
              </div>

              <div className="save-unsave-or-unsuggest-button-wrapper">
                <button
                  data-test={"saved-unsave-button-" + film.slug}
                  onClick={() =>
                    this.props.handleSaveUnsave(
                      "unsavemovie",
                      film.slug,
                      "",
                      "usermovies"
                    )
                  }
                >
                  Unsave
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="user-movies-title">Your Suggestions</h2>

        <div
          data-test="own-suggested-wrapper"
          className="all-suggested-wrapper"
        >
          {userSuggestionsTrailers.map(film => (
            <div
              data-test={"own-suggestion-trailer-wrapper-" + film.slug}
              key={"user-own-suggestion" + film.slug}
            >
              <iframe
                data-test={"own-suggestion-trailer-" + film.slug}
                className="saved-or-suggested-video"
                title={film.title}
                src={film.video}
                allowFullScreen
              />

              <div className="saved-or-suggested-title-year">
                <p data-test={"own-suggestion-trailer-title-" + film.slug}>
                  {film.title}
                </p>
                <p
                  data-test={"own-suggestion-trailer-year-" + film.slug}
                  className="film-year-style"
                >
                  {film.year}
                </p>
              </div>

              <div className="save-unsave-or-unsuggest-button-wrapper">
                <button
                  data-test={
                    "own-suggestion-trailer-unsuggest-button-" + film.slug
                  }
                  onClick={() => this.handleRemoveSuggestion(film.slug)}
                >
                  Unsuggest
                </button>
              </div>
            </div>
          ))}

          {userSuggestionsNoTrailers.map(film => (
            <div
              data-test={"own-suggestion-card-wrapper-" + film.slug}
              key={"own-suggestion-card-" + film.slug}
            >
              <div
                data-test={"own-suggestion-card-" + film.slug}
                className="suggested-movie-tile"
              >
                <p id="tile-title-style">Coming</p>
                <p>Soon</p>
              </div>

              <div className="saved-or-suggested-title-year">
                <p data-test={"own-suggestion-card-title-" + film.slug}>
                  {film.title}
                </p>
                <p
                  data-test={"own-suggestion-card-year-" + film.slug}
                  className="film-year-style"
                >
                  {film.year}
                </p>
              </div>

              <div className="save-unsave-or-unsuggest-button-wrapper">
                <button
                  data-test={
                    "own-suggestion-card-unsuggest-button-" + film.slug
                  }
                  onClick={() => this.handleRemoveSuggestion(film.slug)}
                >
                  Unsuggest
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="user-movies-footer" />
      </div>
    );
  }
}

export default UserMovies;
