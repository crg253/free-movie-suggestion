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
            handleFetch={props.handleFetch}/>

        <div id="genres-and-list">
          <Genres
                setSort={props.setSort}
                sortBy={props.sortBy}
                genres={props.genres}
                chooseListBy={props.chooseListBy}
                listBy={props.listBy}
                randomMovies={props.randomMovies}/>
          <MovieList
                movies={props.movies}
                userSuggestions={props.userSuggestions}
                sortBy={props.sortBy}
                listBy={props.listBy}
                handleFetch={props.handleFetch}/>
        </div>
      </div>
    </div>
  );
};

export default TrailerPage;
