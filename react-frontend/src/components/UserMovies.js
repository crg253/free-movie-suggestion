import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import './User.css';

class User extends Component {

  //UserMovies should be in global state
  state={
    SearchValue:'',
    SearchResultOptions:[],
    MovieMessage:'',
  }

  componentDidMount(){
    //change to getmysuggestions
    fetch('api/getusermovies',{
      method:'GET',
      headers: {
        'Authorization':"Bearer " +localStorage.getItem('token')
        }
    })
    .then(res=>{
      if(res.status===401){
        this.props.setUser('')
        this.props.setSuggestedMovies([])
      }else if(res.status ===201){
        res.json()
          .then(res=>{
                this.props.setSuggestedMovies(res.suggestedMovies)
                this.props.setUser(res.user)
          }
        )
      }
    })
  }

  handleSearchValueChange = (event) =>{
    this.setState({SearchValue:event.target.value, SearchResultOptions:[]});
  }

  handleSearchSubmit = (event) =>{
    this.setState({MovieMessage:''})
    event.preventDefault();
    fetch('http://www.omdbapi.com/?s='+this.state.SearchValue+'&apikey=e0bc91cd')
    .then(res=>res.json())
    .then(res=>{
        if(res.Search !== undefined){
          this.setState({SearchResultOptions:res.Search})
        }});
  }

  handleSuggestMovie = (title, year) =>{
    fetch('api/suggestmovie',{
      method:'POST',
      headers:{
        'Authorization':"Bearer " +localStorage.getItem('token'),
        'Content-Type':'application/json'
      },
      body: JSON.stringify({title: title, year:year})
     })
     .then(res=>{
       if(res.status===500){
         this.setState({SearchResultOptions:[], SearchValue:'',
                        MovieMessage:'Sorry, that movie has already been suggested'})
       }
       else if(res.status===401){
         this.props.setUser('')
       }else if(res.status ===200){
         this.setState({SearchResultOptions:[], SearchValue:'', MovieMessage:"Thank you for suggesting"})
         fetch('api/getusermovies',{
           method:'GET',
           headers: {
             'Authorization':"Bearer " +localStorage.getItem('token')
             }
         })
         .then(res=>{
           if(res.status===401){
             this.props.setUser('')
           }else if(res.status ===201){
             res.json()
             .then(res=>{
                  console.log(res.movies)
                   this.setState({UserMovies:res.movies})
                   this.props.setUser(res.user)
             })
           }
         })
        }
      })
    }


  render() {
    return (
      <div className='user-pages-body-wrapper'>
        <Link to={'/'}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>

        <h1>Hi {this.props.user} !</h1>
        <form onSubmit={this.handleSearchSubmit}>
          <label>
            Search the OMDb to find a movie to suggest.
            <input
                  style={{
                    marginTop:"20px"
                  }}
                  type="text"
                  value={this.state.SearchValue}
                  onChange={this.handleSearchValueChange}/>
          </label>
          <input
                style={{
                  marginTop:"20px"
                }}
                type="submit"
                value="Search"/>
        </form>

        <p>{this.state.MovieMessage}</p>

        {this.state.SearchResultOptions.map(mov=>(
          <div key={"searchresult" + mov.Title+mov.Year}>
          <p>{mov.Title} {mov.Year}</p>
          <button onClick={()=>this.handleSuggestMovie(mov.Title, mov.Year)}>Add</button>
          </div>
        ))}

        {/*
        <h1>Your Movie List</h1>
        {this.state.UserMovies.map(film =>
          <div>
            <h3>{film.name} {film.year}</h3>
            <button onclick={()=>this.handleRemoveMovie(film.name)}>Remove</button>
          </div>)}
        */}
      </div>
    );
  }
}

export default User;
