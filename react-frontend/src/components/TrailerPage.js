import React from "react";
import { Link } from "react-router-dom";

import './TrailerPage.css';
import Trailer from './Trailer';
import Genres from './Genres';
import SelectedList from './SelectedList';

const TrailerPage = (props) => {

  return(
    <div id="trailer-page-wrapper">
      <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
      <div id="trailer-and-list-wrapper">

        <div id="trailer-things-wrapper">
          <div id="genre-and-list-link">
            <p>{props.listby}</p>
            <p><Link to={'/list'}>List</Link></p>
          </div>
          <Trailer id="trailer-component"
              movieslug={props.match.params.movieslug}
              movies={props.movies}
              saveUnsave={props.saveUnsave}
              inSaved={props.inSaved}/>
        </div>

        <div id="genres-and-list">
          <Genres id="genres-component"
                genres={props.genres}
                selectBy={props.selectBy}
                listby={props.listby}/>
          <SelectedList id="selected-list-component"
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
