import React from 'react';
import { Link } from "react-router-dom";

const savedList = (props) => {

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
