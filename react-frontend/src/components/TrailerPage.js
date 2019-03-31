import React from "react";

import NavBar from './NavBar';
import Trailer from './Trailer';
import Genres from './Genres';
import SelectedList from './SelectedList';

const TrailerPage = (props) => {

  return(
    <div>
      <NavBar/>
      <div style={{display:"flex"}} >
        <div style={{margin:"40px 30px 0 30px"}}>
          <Trailer
              movieslug={props.match.params.movieslug}
              movies={props.movies}
              saveUnsave={props.saveUnsave}
              inSaved={props.inSaved}/>
        </div>
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
      </div>
    </div>
  );
};

export default TrailerPage;
