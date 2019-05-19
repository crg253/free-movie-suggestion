import React from "react";
import { Link } from "react-router-dom";

import './TrailerPage.css';
import Trailer from './Trailer';
import Genres from './Genres';
import MovieList from './MovieList';

const TrailerPage = (props) => {

  window.scrollTo(0, 0);
  let randomMovies = props.getRandomMovies()

  return(
    <div>
      <Link to={'/'}>
        <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
      </Link>

      <div id="trailer-and-genres-and-list">
        <Trailer
            movieslug={props.match.params.movieslug}
            movies={props.movies}
            setRedirect={props.setRedirect}
            redirect = {props.redirect}
            setUser={props.setUser}
            setMovies={props.setMovies}
            setRedirectBack={props.setRedirectBack}/>

        <div id="genres-and-list">
          <Genres
                setSort={props.setSort}
                sortBy={props.sortBy}
                genres={props.genres}
                chooseListBy={props.chooseListBy}
                listBy={props.listBy}
                randomMovies={randomMovies}/>
          <MovieList
                movies={props.movies}
                sortBy={props.sortBy}
                listBy={props.listBy}/>
        </div>
      </div>
    </div>
  );
};

export default TrailerPage;
