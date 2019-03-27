import React from 'react';
import { Link } from "react-router-dom";

import AppContext from "./AppContext";

const savedList = () => {

  return(
    <AppContext.Consumer>
    {(context) => context.Movies.filter(movie => context.SavedMovies.includes(movie.id))
    .map(film =>
      <div key={context.SelectBy + film.slug}>
        <Link to={'/' + film.slug}><p>{film.name} {film.year} {film.tags}</p></Link>
      </div>
    )}

    </AppContext.Consumer>
  );
};

export default savedList;
