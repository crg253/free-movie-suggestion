import React from 'react';

import Genres from './Genres';
import SelectedList from './SelectedList';

const ListPage = (props) => {

  return(
    <div>
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
