import React from "react";

import AppContext from "./AppContext";

const MovieList = () => {
  return(
        <div>
          <AppContext.Consumer>
            {(context) =>  context.Movies.map(movie=>(
              <div key={movie.id}>
                <p>{movie.name}</p>
              </div>
            ))}
          </AppContext.Consumer>
        </div>
  );
};

export default MovieList;
