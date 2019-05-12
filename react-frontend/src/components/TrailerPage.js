import React from "react";
import { Link } from "react-router-dom";

import './TrailerPage.css';
import Trailer from './Trailer';
import Genres from './Genres';
import MovieList from './MovieList';

const TrailerPage = (props) => {

  window.scrollTo(0, 0);

  return(
    <div>
      <Link to={'/'}>
        <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
      </Link>

      <div id="trailer-and-genres-and-list">
        <Trailer
            movieslug={props.match.params.movieslug}
            movies={props.movies}
            saveUnsave={props.saveUnsave}
            setUser={props.setUser}/>

        <div id="genres-and-list">
          <Genres
                setSort={props.setSort}
                sortBy={props.sortBy}
                genres={props.genres}
                chooseListBy={props.chooseListBy}
                listBy={props.listBy}
                randomMovies={props.randomMovies}
                setSavedMovies={props.setSavedMovies}
                setUser={props.setUser}/>
          <MovieList
                movies={props.movies}
                userSuggestions={props.userSuggestions}
                sortBy={props.sortBy}
                savedMovies={props.savedMovies}
                unSave = {props.unSave}
                listBy={props.listBy}/>
        </div>
      </div>
    </div>
  );
};

export default TrailerPage;
