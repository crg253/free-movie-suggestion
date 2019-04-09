import React from "react";
import { Link } from "react-router-dom";

import './TrailerPage.css';
import Trailer from './Trailer';
import Genres from './Genres';
import SelectedList from './SelectedList';

const TrailerPage = (props) => {
  window.scrollTo(0, 0)

  return(
    <div>
      <Link to={'/'}>
        <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
      </Link>

      <div id="trailer-genres-list">
        <Trailer
            movieslug={props.match.params.movieslug}
            movies={props.movies}
            saveUnsave={props.saveUnsave}
            inSaved={props.inSaved}/>

        <div id="genre-and-list">
          <Genres
                genres={props.genres}
                selectBy={props.selectBy}
                listby={props.listby}/>
          <SelectedList
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
