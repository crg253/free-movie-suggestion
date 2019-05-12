import React, { Component } from 'react';
import { Link } from "react-router-dom";

class MovieList extends Component {

  render() {

    let selectedMovieList = []
    if(this.props.listBy==="Saved"){
      selectedMovieList= this.props.movies.filter(movie => this.props.savedMovies.includes(movie.slug))
    }else if(this.props.listBy==="All"){
      selectedMovieList = this.props.movies
    }else if(this.props.listBy==="User Suggestions"){
      selectedMovieList = this.props.userSuggestions
    }else{
      selectedMovieList = this.props.movies.filter(movie => movie.tags.includes(this.props.listBy))
    }

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

    if(this.props.sortBy==="year"){
      selectedMovieList.sort(compareYear);
    }else{
      selectedMovieList.sort(compareSlug);
    }
    return (

      <div className="list-items-wrapper">
      {selectedMovieList.map(film =>
          <Link key={film.slug} to={'/' + film.slug}>
            <div className='list-items'>
              <p>{film.name}</p> <p>{film.year}</p>
                {film.tags.map(tag=><p key={film.slug + tag}>{tag}</p>)}
            </div>
          </Link>

      )}
      </div>

    );
  }
}

export default MovieList;
