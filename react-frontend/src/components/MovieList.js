import React from "react";

import Selection from './Selection';
import Genres from './Genres';
import SelectedMovies from './SelectedMovies';

//Need to change the name of this component
const MovieList = ({match}) => {

  return(
    <div  style={{display:"flex"}}>
        <div style={{margin:"40px 30px 0 30px"}}>
          <Selection movieslug={match.params.movieslug}/>
        </div>
        <div style={{margin:"50px 30px 0 30px"}}>
          <Genres/>
          <div style={{margin:"50px 0 0 0", lineHeight:"1.5"}}>
            <SelectedMovies/>
          </div>
        </div>
    </div>
  );
};

export default MovieList;
