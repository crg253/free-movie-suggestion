import React from 'react';

import NavBar from './NavBar';
import Genres from './Genres';
import SelectedList from './SelectedList';

const ListPage = (props) => {

  return(
    <div>
      <NavBar/>
      <h1>List Page</h1>
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
  );
};

export default ListPage;
