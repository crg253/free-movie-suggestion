import React from "react";
import { Link } from "react-router-dom";


import AppProvider from "./AppProvider";
import AppContext from "./AppContext";

const Home = () => {
  return(
    <AppProvider>
      <AppContext.Consumer>
      {(context) =>  context.Genres.map(genre=>(
        <div key={genre.concat('home')}>
        <Link
          to={'/' + context.randomMovies[genre].slug}>{genre}
        </Link>
        </div>
      ))}
      </AppContext.Consumer>
    </AppProvider>
  );
};

export default Home;
