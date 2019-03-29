import React from "react";

import Trailer from './Trailer';
import Genres from './Genres';
import SelectedMovies from './SelectedMovies';

//Need to change the name of this component
const TrailerPage = (props) => {

  return(
    <div>
    <div style={{margin:"40px 30px 0 30px"}}>
      <Trailer
          movieslug={props.match.params.movieslug}
          movies={props.movies}/>
    </div>
    {props.movies.map(movie=><p>{movie.name}</p>)}
    </div>
  );
};

export default TrailerPage;


//
// <div style={{margin:"50px 30px 0 30px"}}>
//   <Genres/>
//   <div style={{margin:"50px 0 0 0", lineHeight:"1.5"}}>
//     <SelectedMovies/>
//   </div>
// </div>
