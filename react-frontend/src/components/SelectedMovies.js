import React from 'react';
import { Link } from "react-router-dom";

import AppContext from "./AppContext";


const SelectedMovies = (props) => {
  return(

    <AppContext.Consumer>
      {(context) =>  context.SelectedMovies.map(movie=>(
        <div key={movie.id}>
          <Link to={'/' + movie.slug}>{movie.name} {movie.year} {movie.tags}</Link>
        </div>
      ))}
    </AppContext.Consumer>
  );
};

export default SelectedMovies;
