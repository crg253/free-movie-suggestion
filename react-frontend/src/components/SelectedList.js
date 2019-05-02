import React from 'react';

import SavedList from './SavedList';
import CompleteList from './CompleteList';
import GenreList from './GenreList';

const SelectedList = (props) => {

  let showList = '';
  if(props.listby==="Saved"){
    showList=<SavedList
              setSort={props.setSort}
              sortby={props.sortby}
              movies={props.movies}
              savedmovies={props.savedmovies}
              unsave={props.unsave}/>
  }else if(props.listby==="All"){
    showList=<CompleteList
              setSort={props.setSort}
              sortby={props.sortby}
              movies={props.movies}/>
  }else if(props.listby==="User Suggestions"){
    showList=<CompleteList
              setSort={props.setSort}
              sortby={props.sortby}
              movies={props.userMovies}/>
  }else{
    showList=<GenreList
              setSort={props.setSort}
              sortby={props.sortby}
              movies={props.movies}
              listby={props.listby}/>
  }

  return(
    <div id="selected-list">
    {showList}
    </div>
  );
};

export default SelectedList;
