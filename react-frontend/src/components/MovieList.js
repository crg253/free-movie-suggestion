import React from "react";

import AppProvider from "./AppProvider";
import AppContext from "./AppContext";

const MovieList = () => {
  return(

    <AppProvider>

    <h1>{props.testProps}</h1>


      <div style={{display:"flex"}}>
        <AppContext.Consumer>
          {(context) =>  context.Genres.map(genre=>(
            <div key={genre} style={{marginRight:'10px'}}>
              <p>{genre}</p>
                <button onClick={()=>context.chooseGenre(genre)}></button>
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
