import React from "react";
import { Link } from "react-router-dom";

import AppContext from "./AppContext";

const Home = () => {
  return(
      <AppContext.Consumer>
      {(context) =>  context.Genres.map(genre=>(
        <div
          style={{margin:"40px 0 0 35%"}}
          key={genre.concat('home')}
          onClick={()=>context.chooseGenre(genre)}>
          <h1>
          <Link to={'/' + context.randomMovies[genre].slug}>{genre}</Link>
          </h1>
        </div>
      ))}
      </AppContext.Consumer>
  );
};

export default Home;
