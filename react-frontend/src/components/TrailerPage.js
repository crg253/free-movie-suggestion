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
            handleSaveUnsave ={props.handleSaveUnsave}
            handleTokenFetch={props.handleTokenFetch}/>

        <div id="genres-and-list">
          <Genres
                setSort={props.setSort}
                sortBy={props.sortBy}
                genres={props.genres}
                chooseListBy={props.chooseListBy}
                listBy={props.listBy}
                randomMovies={props.randomMovies}
                movieslug={props.match.params.movieslug}
                handleGetSavedMovies= {props.handleGetSavedMovies}/>
          <MovieList
                movies={props.movies}
                userSuggestions={props.userSuggestions}
                sortBy={props.sortBy}
                listBy={props.listBy}
                handleSaveUnsave ={props.handleSaveUnsave}/>
        </div>
      </div>
    </div>
  );
};

export default TrailerPage;
