import React from "react";

import AppProvider from "./AppProvider";
import AppContext from "./AppContext";

const MovieList = ({match}) => {
  return(


    <AppProvider>

    <AppContext.Consumer>
      {(context) => context.Movies.filter(movie=>movie.slug === match.params.movieslug)
        .map(selection=>(
          <div
            style={{
              margin:"30px 0 0 40px",
              width: "300px",
            }}>
            <iframe title={selection.name} src = {selection.video}></iframe>
            <h1 >{selection.name} {selection.year}</h1>
          </div>
          ))}
     </AppContext.Consumer>

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
