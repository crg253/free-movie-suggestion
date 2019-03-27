import React from 'react';
import { Link } from "react-router-dom";

import AppContext from "./AppContext";

const completeList = () => {

  return(
    <AppContext.Consumer>
    {(context) => context.Movies.map(movie =>
      <div key={movie.tags[0].concat(movie.slug)}>
        <Link to={'/' + movie.slug}><p>{movie.name} {movie.year} {movie.tags}</p></Link>
      </div>
     )}

    </AppContext.Consumer>
  );
};

export default completeList;
