import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';

import './UserForm.css';

class Recommend extends Component {

  //UserMovies should be in global state
  state={
    SearchValue:"",
    SearchResultOptions:[],
    MovieMessage:"",
  }

  handleSearchValueChange = (event) =>{
    this.setState({SearchValue:event.target.value, SearchResultOptions:[]});
  }

  handleSearchSubmit = (event) =>{
    this.setState({MovieMessage:""})
    event.preventDefault();
    fetch("http://www.omdbapi.com/?s="+this.state.SearchValue+"&apikey=e0bc91cd")
    .then(res=>res.json())
    .then(res=>{
        if(res.Search !== undefined){
          this.setState({SearchResultOptions:res.Search})
        }});
  }

  handleSuggestMovie = (title, year) =>{
    fetch('/api/suggestmovie',{
      method:'POST',
      headers:{
         'Authorization':'Bearer ' +localStorage.getItem('token'),
         'Content-Type':'application/json'
       },
      body: JSON.stringify({title: title, year:year})
    })
    .then(res=>{
      if (res.status===500) {
        this.setState({
          SearchValue:"",SearchResultOptions:[], MovieMessage:"Movie already selected."})
    }
    else if (res.status===401) {
      res.json()
       .then(res=>{
         this.props.setUser(res.user)
         this.props.setEmail(res.email)
         this.props.setMovies(res.movies)
         this.props.setRedirectBack('')
         this.props.setRedirectBackSlug('recommend')
         this.props.setRedirect(<Redirect to='/signin'/>)
      })
    }
    else if (res.status===200){
      res.json()
        .then(res=>{
          this.props.setUser(res.user)
          this.props.setEmail(res.email)
          this.props.setMovies(res.movies)
          this.setState({
            SearchValue:"",SearchResultOptions:[], MovieMessage:"Thank you for suggesting."})
       })
     }
    })
  }

  render() {
    return (
      <div>
      {this.props.redirect}
        <Link to={'/'}>
          <h1 id='main-title'>FREE MOVIE SUGGESTION</h1>
        </Link>

        <div className='user-pages-body-wrapper'>
        <h1 >Hi {this.props.user} !</h1>
        <form onSubmit={this.handleSearchSubmit}>
          <label>
            Search the OMDb to find a movie to suggest.
            <input
                  style={{marginTop:'20px'}}
                  type='text'
                  value={this.state.SearchValue}
                  onChange={this.handleSearchValueChange}/>
          </label>
          <input
                className='form-submit-button'
                type='submit'
                value='Search'/>
        </form>

        <h4>{this.state.MovieMessage}</h4>

        {this.state.SearchResultOptions.map(mov=>(
          <div key={'searchresult' + mov.Title+mov.Year}>
          <p>{mov.Title} {mov.Year}</p>
          <button onClick={()=>this.handleSuggestMovie(mov.Title, mov.Year)}>
            Add
          </button>
          </div>
        ))}
        </div>
        <div className='form-footer'></div>
      </div>
    );
  }
}

export default Recommend;
