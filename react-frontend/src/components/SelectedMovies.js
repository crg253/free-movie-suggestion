import React from 'react';

import AppContext from "./AppContext";


const SelectedMovies = (props) => {
  return(

    <AppContext.Consumer>
      {(context) =>  context.SelectedMovies.map(movie=>(
        <div key={movie.id}>
          <p>{movie.name} {movie.year} {movie.tags}</p>
        </div>
      ))}
    </AppContext.Consumer>
  );
};

export default SelectedMovies;
