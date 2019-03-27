import React from 'react';
import { Link } from "react-router-dom";

import AppContext from "./AppContext";

const genreList = () => {

  return(
    <AppContext.Consumer>
    {(context) => context.Movies.filter(movie => movie.tags.includes(context.SelectBy))
    .map(film =>
      <div key={context.SelectBy + film.slug}>
        <Link to={'/' + film.slug}><p>{film.name} {film.year} {film.tags}</p></Link>
      </div>
    )}

    </AppContext.Consumer>


  );
};

export default genreList;

//
// {(context) => context.Movies.filter(movie =>(movie.tags.includes("Action")
//   .map(film=>(
//     <p>{film.name}</p>
//   ))))}
