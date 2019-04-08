import React from 'react';
import { Link } from "react-router-dom";

import './ListPage.css';
import Genres from './Genres';
import SelectedList from './SelectedList';

const ListPage = (props) => {

  return(
    <div id="list-page-wrapper">
      <Link to={'/'}>
        <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
      </Link>
      <div id="genres-and-list-wrapper">
        <Genres
              genres={props.genres}
              selectBy={props.selectBy}/>
        <SelectedList
              movies ={props.movies}
              savedmovies={props.savedmovies}
              unsave = {props.unsave}
              genres ={props.genres}
              listby={props.listby}/>
      </div>
    </div>
  );
};

export default ListPage;
