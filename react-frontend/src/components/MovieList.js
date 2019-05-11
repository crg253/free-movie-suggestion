import React, { Component } from 'react';
import { Link } from "react-router-dom";

class MovieList extends Component {


  render() {

    fetch('api/movies')
    .then(res=>res.json())
    .then(res=>{
      if(res.length > this.props.movies.length + this.props.userMovies.length){
        this.props.refreshMovies(res)
       }
    })

    let selectedMovieList = []
    if(this.props.listby==="Saved"){
      selectedMovieList= this.props.movies.filter(movie => this.props.savedmovies.includes(movie.slug))
    }else if(this.props.listby==="All"){
      selectedMovieList = this.props.movies
    }else if(this.props.listby==="User Suggestions"){
      selectedMovieList = this.props.userMovies
    }else{
      selectedMovieList = this.props.movies.filter(movie => movie.tags.includes(this.props.listby))
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

    if(this.props.sortby==="year"){
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
