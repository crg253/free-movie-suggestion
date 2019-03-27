import React from "react";
import { Link } from "react-router-dom";

import AppContext from "./AppContext";

const Home = () => {
  return(
      <AppContext.Consumer>
      {(context) =>  context.Genres.map(genre=>(
        <div
          onClick={()=>context.chooseGenre(genre)}
          style={{textAlign:"center"}}
          key={genre.concat('home')}>
          <h2
            style={{lineHeight:"0.8"}}>
          <Link to={'/' + context.randomMovies[genre].slug}>{genre}</Link>
          </h2>
        </div>
      ))}
      </AppContext.Consumer>
  );
};

export default Home;
