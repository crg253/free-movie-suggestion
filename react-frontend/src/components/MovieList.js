import React from "react";

import AppProvider from "./AppProvider";
import AppContext from "./AppContext";

const MovieList = () => {
  return(
        <AppProvider>
        <AppContext.Consumer>
          {(context) =>  context.Genres.map(genre=>(
            <div key={genre}>
              <p>{genre}</p>
            </div>
          ))}
        </AppContext.Consumer>
          <AppContext.Consumer>
            {(context) =>  context.Movies.map(movie=>(
              <div key={movie.id}>
                <p>{movie.name}</p>
              </div>
            ))}
          </AppContext.Consumer>
        </AppProvider>
    );
};

export default MovieList;
