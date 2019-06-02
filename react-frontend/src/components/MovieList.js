import React, { Component } from 'react';
import { Link } from "react-router-dom";

class MovieList extends Component {


  render() {

    let selectedMovieList = []
    if(this.props.upperGenre==="Saved"){
      selectedMovieList= this.props.movies.filter(movie=>movie.saved===true)
    }else if(this.props.upperGenre==="All"){
      selectedMovieList = this.props.movies.filter(movie=>movie.status==='approved')
    }else if(this.props.upperGenre==="User Suggestions"){
      selectedMovieList = this.props.movies.filter(movie=>movie.status==='pending')
    }else{
      selectedMovieList = this.props.movies
      .filter(movie=>movie.status==='approved')
      .filter(movie => movie.tags.includes(this.props.upperGenre))
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

    let chosenList = ''
    if(this.props.upperGenre==="Saved"){
      chosenList =
        <div>
        {selectedMovieList.map(film =>
        <div key={'saved'+film.slug} onClick={()=>this.props.setLastMovie(film.slug)}>
          <Link to={'/'+this.props.genreslug + '/' + film.slug}>
            <div className='list-items'>
              <p>{film.name}</p> <p>{film.year}</p>
                {film.tags.map(tag=><p key={film.slug + tag}>{tag}</p>)}
            </div>
          </Link>
            <div className='list-unsave-button'>
              <button
                onClick = {()=>this.props.handleSaveUnsave('unsavemovie',film.slug)}
                >unsave</button>
            </div>
        </div>
      )}
      </div>
    }else{
      chosenList =
        <div>
        {selectedMovieList.map(film =>
          <div key={film.slug} onClick={()=>this.props.setLastMovie(film.slug)}>
            <Link to={'/' +this.props.genreslug +'/' + film.slug}>
              <div className='list-items'>
                <p>{film.name}</p> <p>{film.year}</p>
                  {film.tags.map(tag=><p key={film.slug + tag}>{tag}</p>)}
              </div>
            </Link>
          </div>
      )}
      </div>
    }

    return (

      <div className="list-items-wrapper">
      {chosenList}
      </div>

    );
  }
}

export default MovieList;
