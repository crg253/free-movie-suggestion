import React, { Component } from 'react';
import { Link } from "react-router-dom";

class MovieList extends Component {


  render() {

    let selectedMovieList = []
    if(this.props.upperGenre==="All"){
      selectedMovieList = this.props.movies
                    .filter(movie=>movie.status==='approved')
    }else{
      selectedMovieList = this.props.movies
                    .filter(movie=>movie.status==='approved')
                    .filter(movie => movie.tags.includes(this.props.upperGenre))
    }

    if(this.props.sortBy==="year"){
      selectedMovieList.sort(this.props.compareYear);
    }else{
      selectedMovieList.sort(this.props.compareSlug);
    }

    return (

      <div className="list-items-wrapper">
      {selectedMovieList.map(film =>
        <div key={film.slug}>
          <Link to={'/' +this.props.genreslug +'/' + film.slug}>
            <div className='list-items'>
              <p>{film.name}</p> <p>{film.year}</p>
                {film.tags.map(tag=><p key={film.slug + tag}>{tag}</p>)}
            </div>
          </Link>
        </div>
      )}
      </div>

    );
  }
}

export default MovieList;
