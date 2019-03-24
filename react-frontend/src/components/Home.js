import React from "react";

import AppProvider from "./AppProvider";
import AppContext from "./AppContext";

const Home = () => {
  return(
    <AppProvider>
      <AppContext.Consumer>
      {(context) =>  context.Genres.map(genre=>(
        <div key = {genre.concat("home")}>
          <h2>{genre}</h2>
          <p>{context.randomMovies[genre].name}{context.randomMovies[genre].tags}</p>
        </div>
      ))}
      </AppContext.Consumer>
    </AppProvider>
  );
};

export default Home;
