import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';

import './User.css';

class User extends Component {

  state={
    UserMovies:[],
    SearchValue:'',
    SearchResultOptions:[],
    Redirect:''
  }

  componentDidMount(){
    fetch('api/usermovies',{
      method:'GET',
      headers: {
        'Authorization':"Bearer " +localStorage.getItem('token')
        }
    })
    .then(res=>{
      if(res.status===401){
        this.setState({Redirect:<Redirect to='/signin'/>})
      }else if(res.status ===201){
        res.json()
          .then(res=>this.setState({UserMovies:res}))
      }
    })
  }

  handleSearchValueChange = (event) =>{
    this.setState({SearchValue:event.target.value, SearchResultOptions:[]});
  }

  handleSearchSubmit = (event) =>{
    event.preventDefault();
    fetch('http://www.omdbapi.com/?s='+this.state.SearchValue+'&apikey=e0bc91cd')
    .then(res=>res.json())
    .then(res=>{
        if(res.Search !== undefined){
          this.setState({SearchResultOptions:res.Search})
        }});
  }

  handleAddMovie = (title, year) =>{
    fetch('api/addmovie',{
      method:'POST',
      headers:{
        'Authorization':"Bearer " +localStorage.getItem('token'),
        'Content-Type':'application/json'
      },
      body: JSON.stringify({title: title, year:year})
     })
     .then(res=>{
       if(res.status===401){
         this.setState({Redirect:<Redirect to='/signin'/>})
       }else if(res.status ===200){
         this.setState({SearchResultOptions:[], SearchValue:''})
         fetch('api/usermovies',{
           method:'GET',
           headers: {
             'Authorization':"Bearer " +localStorage.getItem('token')
             }
         })
         .then(res=>{
           if(res.status===401){
             this.setState({Redirect:<Redirect to='/signin'/>})
           }else if(res.status ===201){
             res.json()
               .then(res=>this.setState({UserMovies:res}))
           }
         })
        }
      })
  }



  handleSignOut = () =>{
    fetch('api/revoketoken', {
      method:'DELETE',
      headers:{
        'Authorization':"Bearer " +localStorage.getItem('token')
      }
    })
    .then(res=>{
      this.setState({Redirect:<Redirect to='/signin'/>})
    })
  }

  render() {
    console.log(this.state.UserMovies)

    return (
      <div className='user-pages-body-wrapper'>
        {this.state.Redirect}
        <Link to={'/'}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>

        <form onSubmit={this.handleSearchSubmit}>
          <label>
            Find Movie:
            <input
                  type="text"
                  value={this.state.SearchValue}
                  onChange={this.handleSearchValueChange}/>
          </label>
          <input
                 type="submit"
                 value="Submit"/>
        </form>

        {this.state.SearchResultOptions.map(mov=>(
          <div>
          <p>{mov.Title} {mov.Year}</p>
          <button onClick={()=>this.handleAddMovie(mov.Title, mov.Year)}>Add</button>
          </div>
        ))}

        {this.state.UserMovies.map(film =><h1>{film.name} {film.year}</h1>)}

        <a href='javascript:void(0);' onClick={()=>this.handleSignOut()}>sign out</a>
      </div>
    );
  }
}

export default User;
