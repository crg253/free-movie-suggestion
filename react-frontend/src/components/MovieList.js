import React from "react";

import Selection from './Selection';
import Genres from './Genres';
import SelectedMovies from './SelectedMovies';


const MovieList = ({match}) => {

  return(
    <div  style={{display:"flex"}}>
        <div style={{margin:"40px 30px 0 30px"}}>
          <Selection movieslug={match.params.movieslug}/>
        </div>
        <div style={{margin:"50px 30px 0 30px"}}>
          <Genres/>
          <SelectedMovies/>
        </div>
    </div>
  );
};

export default MovieList;
