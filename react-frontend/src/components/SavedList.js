import React from 'react';
import { Link } from "react-router-dom";

const savedList = (props) => {

  return(
    props.movies.filter(movie => props.savedmovies.includes(movie.id))
    .map(film =>
      <div>
        <Link to={'/' + film.slug}><p>{film.name} {film.year} {film.tags}</p></Link>
        <button onClick={()=>props.unsave(film.id)}>Remove</button>
      </div>
    )
  );
};

export default savedList;
