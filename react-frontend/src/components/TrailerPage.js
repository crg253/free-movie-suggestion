import React from "react";
import { Link } from "react-router-dom";

import './TrailerPage.css';
import Menu from './Menu'
import Trailer from './Trailer';
import Genres from './Genres';
import SelectedList from './SelectedList';

const TrailerPage = (props) => {

  if(props.match.params.movieslug!==props.param){
    props.setparam(props.match.params.movieslug)
    window.scrollTo(0, 0)
  }

  return(
    <div>
      <Link to={'/'}>
        <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
      </Link>
      <Menu/>

      <div id="trailer-and-genres-and-list">
        <Trailer
            movieslug={props.match.params.movieslug}
            movies={props.movies}
            saveUnsave={props.saveUnsave}
            inSaved={props.inSaved}/>

        <div id="genres-and-list">
          <Genres
                setSort={props.setSort}
                sortby={props.sortby}
                genres={props.genres}
                selectBy={props.selectBy}
                listby={props.listby}
                inlistby={props.inlistby}
                randomMovies={props.randomMovies}/>
          <SelectedList
                userMovies={props.userMovies}
                setSort={props.setSort}
                sortby={props.sortby}
                movies ={props.movies}
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
