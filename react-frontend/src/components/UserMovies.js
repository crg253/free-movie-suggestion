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
      if (res.status === 401) {
        this.props.setUser("");
        this.props.setEmail("");
        this.props.handleGetMovies("");
        this.props.setRedirectBack("");
        this.props.setRedirectBackSlug("usermovies");
        this.props.setRedirect(<Redirect to="/signin" />);
      } else if (res.status === 200) {
        res.json().then(res => {
          this.props.setUser(res.user);
          this.props.setEmail(res.email);
          this.props.handleGetMovies(res.user);
        });
      }
    });
  };

  render() {
    let userSaves = this.props.movies.filter(movie => movie.saved === true);
    userSaves.sort(this.props.compareSlug);

    let userSuggestionsTrailers = this.props.movies
      .filter(movie => movie.recommendedBy === this.props.user)
      .filter(film => film.video != null);
    userSuggestionsTrailers.sort(this.props.compareSlug);

    let userSuggestionsNoTrailers = this.props.movies
      .filter(movie => movie.recommendedBy === this.props.user)
      .filter(film => film.video === null);
    userSuggestionsNoTrailers.sort(this.props.compareSlug);

    return (
      <div>
        {this.props.redirect}

        <Link to={"/"}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>

        <h2 className="user-movies-title">Your Saved Movies</h2>
        <div data-test="user-saved-movies" id="saved-movies-wrapper">
          {userSaves.map(film => (
            <div key={"usersave" + film.slug}>
              <iframe
                className="saved-or-suggested-video"
                title={film.title}
                src={film.video}
                allowFullScreen
              />
              <div className="saved-or-suggested-title-year">
                <p>{film.title}</p>
                <p className="film-year-style">{film.year}</p>
              </div>
              <div className="save-unsave-or-unsuggest-button-wrapper">
                <button
                  data-test={"user-movies-" + film.slug + "-unsave-button"}
                  onClick={() =>
                    this.props.handleSaveUnsave(
                      "unsavemovie",
                      film.slug,
                      "",
                      "usermovies"
                    )
                  }
                >
                  unsave
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="user-movies-title">Your Suggestions</h2>

        <div data-test="user-own-suggested" className="all-suggested-wrapper">
          {userSuggestionsTrailers.map(film => (
            <div
              data-test={"user-own-suggestion-with-trailer-" + film.slug}
              key={"user-own-suggestion" + film.slug}
            >
              <iframe
                className="saved-or-suggested-video"
                title={film.title}
                src={film.video}
                allowFullScreen
              />
              <div className="saved-or-suggested-title-year">
                <p>{film.title}</p>
                <p className="film-year-style">{film.year}</p>
              </div>
              <div className="save-unsave-or-unsuggest-button-wrapper">
                <button
                  data-test={"unsuggest-" + film.slug}
                  onClick={() => this.handleRemoveSuggestion(film.slug)}
                >
                  unsuggest
                </button>
              </div>
            </div>
          ))}

          {userSuggestionsNoTrailers.map(film => (
            <div
              data-test={"user-own-suggestion-with-no-trailer-" + film.slug}
              key={"user-own-suggestion" + film.slug}
            >
              <div className="suggested-movie-tile">
                <p id="tile-title-style">Coming</p>
                <p>Soon</p>
              </div>

              <div className="saved-or-suggested-title-year">
                <p>{film.title}</p>
                <p className="film-year-style">{film.year}</p>
              </div>
              <div className="save-unsave-or-unsuggest-button-wrapper">
                <button
                  data-test={"unsuggest-" + film.slug}
                  onClick={() => this.handleRemoveSuggestion(film.slug)}
                >
                  unsuggest
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
