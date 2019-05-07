import React from 'react';
import { Link } from "react-router-dom";

const genreList = (props) => {

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
        props.movies.sort(compareYear);
      }else{
        props.movies.sort(compareSlug);
      }

  return(
    <div class="list-items-wrapper">
    {props.movies.filter(movie => movie.tags.includes(props.listby))
    .map(film =>
        <Link to={'/' + film.slug}>
          <div class='list-items'>
            <p>{film.name}</p> <p>{film.year}</p> {film.tags.map(tag=><p>{tag}</p>)}
          </div>
        </Link>

    )}
    </div>
  );
};

export default genreList;
