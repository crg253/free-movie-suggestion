import React from 'react';
import { Link } from "react-router-dom";

const MovieList = (props) => {

      function dropThe(slug) {
        if (slug.slice(0,3)==="the"){
          return slug.slice(3,)
        }else{
          return slug
        }
      }

      function compareYear(a,b) {
      if (a.year < b.year)
        return -1;
      if (a.year > b.year)
        return 1;
      return 0;
      }

      function compareSlug(a,b) {
      if (dropThe(a.slug) < dropThe(b.slug))
        return -1;
      if (dropThe(a.slug) > dropThe(b.slug))
        return 1;
      return 0;
      }

      if(props.sortby==="year"){
        props.selectedmovies.sort(compareYear);
      }else{
        props.selectedmovies.sort(compareSlug);
      }

  return(
    <div className="list-items-wrapper">
    {props.selectedmovies.map(film =>
        <Link to={'/' + film.slug}>
          <div className='list-items'>
            <p>{film.name}</p> <p>{film.year}</p> {film.tags.map(tag=><p>{tag}</p>)}
          </div>
        </Link>

    )}
    </div>
  );
};

export default MovieList;
