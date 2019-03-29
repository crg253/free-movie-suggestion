import React from "react";

import Selection from './Selection';
import Genres from './Genres';
import SelectedMovies from './SelectedMovies';

//Need to change the name of this component
const TrailerPage = (props) => {

  return(
    <div>
    {props.movies.map(movie=><p>{movie.name}</p>)}
    </div>
  );
};

export default TrailerPage;

// <div style={{margin:"40px 30px 0 30px"}}>
//   <Selection movieslug={match.params.movieslug}/>
// </div>
//
// <div style={{margin:"50px 30px 0 30px"}}>
//   <Genres/>
//   <div style={{margin:"50px 0 0 0", lineHeight:"1.5"}}>
//     <SelectedMovies/>
//   </div>
// </div>
