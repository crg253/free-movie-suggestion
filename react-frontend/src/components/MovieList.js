import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";

class MovieList extends Component {

  state={
    Redirect:''
  }

  handleUnsaveMovie = (slug) =>{
    fetch('api/unsavemovie',{
      method:'POST',
      headers:{
        'Authorization':"Bearer " +localStorage.getItem('token'),
        'Content-Type':'application/json'
      },
      body: JSON.stringify({slug: slug})
     })
     .then(res=>{
       if(res.status===401){
         this.props.setUser('')
         this.props.setSavedMovies([])
         this.props.setSignInRedirect(this.props.movieslug)
         this.setState({Redirect:<Redirect to='/signin'/>})
       }else if(res.status ===200){
         res.json()
         .then(res=>{
               this.props.setUser(res.user)
               this.props.setSavedMovies(res.savedMovies)
         })
       }
    })
  }


  render() {

    let selectedMovieList = []
    if(this.props.listBy==="Saved"){
      selectedMovieList= this.props.savedMovies
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
                onClick = {()=>this.handleUnsaveMovie(film.slug)}
                >unsave</button>
            </div>
        </div>
      )}
      </div>
    }else{
      chosenList =
        <div>
        {selectedMovieList.map(film =>
          <Link key={film.slug} to={'/' + film.slug}>
            <div className='list-items'>
              <p>{film.name}</p> <p>{film.year}</p>
                {film.tags.map(tag=><p key={film.slug + tag}>{tag}</p>)}
            </div>
          </Link>
      )}
      </div>
    }

    return (

      <div className="list-items-wrapper">
      {this.state.Redirect}
      {chosenList}

      </div>

    );
  }
}

export default MovieList;
