import React from 'react';
import { Link } from "react-router-dom";

const completeList = (props) => {

  return(
    props.movies.map(movie =>
      <div key={movie.tags[0].concat(movie.slug)}>
        <Link to={'/' + movie.slug}><p>{movie.name} {movie.year} {movie.tags}</p></Link>
      </div>
     )
  );
};

export default completeList;
