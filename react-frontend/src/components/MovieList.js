import React from "react";

import AppProvider from "./AppProvider";
import AppContext from "./AppContext";

const MovieList = () => {
  return(

    <AppProvider>

      <div style={{display:"flex"}}>
        <AppContext.Consumer>
          {(context) =>  context.Genres.map(genre=>(
            <div key={genre} style={{marginRight:'10px'}}>
              <p>{genre}</p>

              <AppContext.Consumer>
                {(context) => <button onClick={()=>context.selectMoviesByGenre(genre)}></button>}
              </AppContext.Consumer>

            </div>
          ))}
        </AppContext.Consumer>
      </div>

      <h1>Selected Movies</h1>
      <AppContext.Consumer>
        {(context) =>  context.SelectedMovies.map(movie=>(
          <div key={movie.id}>
            <p>{movie.name} {movie.year} {movie.tags}</p>
          </div>
        ))}
      </AppContext.Consumer>

    </AppProvider>
  );
};

export default MovieList;
