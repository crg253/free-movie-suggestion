import React from "react";
import { Link } from "react-router-dom";

import './TrailerPage.css';
import Trailer from './Trailer';
import Genres from './Genres';
import MovieList from './MovieList';

const TrailerPage = (props) => {

  window.scrollTo(0, 0);

  let selectedmovies = []
  if(props.listby==="Saved"){
    selectedmovies= props.movies.filter(movie => props.savedmovies.includes(movie.slug))
  }else if(props.listby==="All"){
    selectedmovies = props.movies
  }else if(props.listby==="User Suggestions"){
    selectedmovies = props.userMovies
  }else{
    selectedmovies = props.movies.filter(movie => movie.tags.includes(props.listby))

  }

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
            inSaved={props.inSaved}
            savedmovies={props.savedmovies}/>

        <div id="genres-and-list">
          <Genres
                setSort={props.setSort}
                sortby={props.sortby}
                genres={props.genres}
                selectBy={props.selectBy}
                listby={props.listby}
                inlistby={props.inlistby}
                randomMovies={props.randomMovies}/>
          <MovieList
                userMovies={props.userMovies}
                setSort={props.setSort}
                sortby={props.sortby}
                selectedmovies ={selectedmovies}
                savedmovies={props.savedmovies}
                unsave = {props.unsave}
                genres ={props.genres}
                listby={props.listby}/>
        </div>
      </div>
    </div>
  );
};

export default TrailerPage;
