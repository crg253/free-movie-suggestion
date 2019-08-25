import React, {Component} from "react";
import {Link} from "react-router-dom";

class MovieList extends Component {
  render() {
    let selectedMovieList = this.props.movies
      .filter(movie => movie.recommendedBy === "crg253")
      .filter(movie => movie.slug !== "comingsoon");
    if (this.props.upperGenre !== "All") {
      selectedMovieList = selectedMovieList.filter(movie =>
        movie.tags.includes(this.props.upperGenre)
      );
    }

    if (this.props.sortBy === "year") {
      selectedMovieList.sort(this.props.compareYear);
    } else {
      selectedMovieList.sort(this.props.compareTitle);
    }

    return (
      <div data-test="movie-list" id="movie-list-wrapper">
        {selectedMovieList.map(film => (
          <div
            data-test={"movie-list-item-" + film.slug}
            key={"movie-list-item-" + film.slug}
          >
            <Link to={"/" + this.props.genreslug + "/" + film.slug}>
              <div className="list-items">
                <p>{film.title}</p> <p>{film.year}</p>
                {film.tags.map(tag => (
                  <p key={film.slug + tag}>{tag}</p>
                ))}
              </div>
            </Link>
          </div>
        ))}
      </div>
    );
  }
}

export default MovieList;
