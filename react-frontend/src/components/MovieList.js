import React, { Component } from 'react';
import { Link } from "react-router-dom";

class MovieList extends Component {

  handleUnsave = (slug) =>{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let body = JSON.stringify({slug: slug})
    this.props.handleFetch('unsavemovie', headers, body)
  }


  render() {

    let selectedMovieList = []
    if(this.props.listBy==="Saved"){
      selectedMovieList= this.props.movies.filter(movie=>movie.saved===true)
    }else if(this.props.listBy==="All"){
      selectedMovieList = this.props.movies.filter(movie=>movie.status==='approved')
    }else if(this.props.listBy==="User Suggestions"){
      selectedMovieList = this.props.movies.filter(movie=>movie.status==='pending')
    }else{
      selectedMovieList = this.props.movies
      .filter(movie=>movie.status==='approved')
      .filter(movie => movie.tags.includes(this.props.listBy))
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
    if(this.props.listBy==="Saved"){
      chosenList =
        <div>
        {selectedMovieList.map(film =>
        <div key={'saved'+film.slug}>
          <Link to={'/' + film.slug}>
            <div className='list-items'>
              <p>{film.name}</p> <p>{film.year}</p>
                {film.tags.map(tag=><p key={film.slug + tag}>{tag}</p>)}
            </div>
          </Link>
            <div className='list-unsave-button'>
              <button
                onClick = {()=>this.handleUnsave(film.slug)}
                >unsave</button>
            </div>
        </div>
      )}
      </div>
    }else if (this.props.listBy==="User Suggestions") {
      chosenList =
        <div>
        {selectedMovieList.map(film =>
          <div key={film.slug} className='list-items'>
            <p>{film.name}</p> <p>{film.year}</p> <p>{film.username}</p>
          </div>
      )}
      </div>
    }else{
      chosenList =
        <div>
        {selectedMovieList.map(film =>
          <div key={film.slug}>
            <Link to={'/' + film.slug}>
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
