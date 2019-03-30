import React from 'react';
import { Link } from "react-router-dom";

const genreList = (props) => {

  return(
    props.movies.filter(movie => movie.tags.includes(props.listby))
    .map(film =>
      <div>
        <Link to={'/' + film.slug}><p>{film.name} {film.year} {film.tags}</p></Link>
      </div>
    )
  );
};

export default genreList;
