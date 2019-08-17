import React, {Component} from "react";
import {Link} from "react-router-dom";

class Genres extends Component {
  componentDidMount() {
    let i = this.props.scrollGenres.indexOf(this.props.upperGenre);
    if (i === 0) {
      this.props.setIndexes(8, i, 1);
    } else if (i === 8) {
      this.props.setIndexes(7, i, 0);
    } else {
      this.props.setIndexes(i - 1, i, i + 1);
    }
  }

  render() {
    let randomMovies = this.props.getRandomMovies();
    let goUpButton = "";
    let goDownButton = "";

    if (randomMovies["All"] !== undefined) {
      goDownButton = (
        <Link
          to={
            "/" +
            this.props.changeGenreCase(
              "toLower",
              this.props.scrollGenres[this.props.indexDown]
            ) +
            "/" +
            randomMovies[this.props.scrollGenres[this.props.indexDown]].slug
          }
          onClick={() => {
            this.props.subtractGenreIndex();
          }}
        >
          <button
            data-test="genres-back-button"
            className="button-nostyle"
            id="back-genres-button"
          />
        </Link>
      );

      goUpButton = (
        <Link
          to={
            "/" +
            this.props.changeGenreCase(
              "toLower",
              this.props.scrollGenres[this.props.indexUp]
            ) +
            "/" +
            randomMovies[this.props.scrollGenres[this.props.indexUp]].slug
          }
          onClick={() => {
            this.props.addGenreIndex();
          }}
        >
          <button
            data-test="genres-forward-button"
            className="button-nostyle"
            id="forward-genres-button"
          />
        </Link>
      );
    }

    return (
      <div id="main-genres-wrapper">
        <div id="genre-and-button">
          <h2
            data-test="selected-genre"
            className="selected-genre"
            id={this.props.upperGenre.slice(0, 3)}
          >
            {this.props.upperGenre}
          </h2>

          {goDownButton}
          {goUpButton}
        </div>
        {/* id= genre-and-button */}

        {/* sort-by-wrapper  */}
        <div id="sort-by-wrapper">
          <p className="sort-selector">sort by </p>

          <button
            id="title-sort-button"
            style={{color: this.props.sortBy === "name" ? "white" : "grey"}}
            className="sort-selector button-nostyle"
            onClick={() => this.props.setSort("name")}
          >
            TITLE
          </button>
          <button
            id="year-sort-button"
            style={{color: this.props.sortBy === "year" ? "white" : "grey"}}
            className="sort-selector button-nostyle"
            onClick={() => this.props.setSort("year")}
          >
            YEAR
          </button>
        </div>
        {/* END -- sort-by wrapper */}
      </div> //END -- Big main container
    );
  }
}

export default Genres;
