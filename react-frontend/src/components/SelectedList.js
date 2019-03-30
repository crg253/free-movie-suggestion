import React from 'react';

import SavedList from './SavedList';
import CompleteList from './CompleteList';
import GenreList from './GenreList';

const SelectedList = (props) => {

  let showList = '';
  if(props.listby==="Saved"){
    showList=<SavedList
              movies={props.movies}
              savedmovies={props.savedmovies}
              unsave={props.unsave}/>
  }else if(props.listby==="All"){
    showList=<CompleteList movies={props.movies}/>
  }else{
    showList=<GenreList
                movies={props.movies}
                listby={props.listby}/>
  }

  return(
    <div>
    {showList}
    </div>
  );
};

export default SelectedList;
