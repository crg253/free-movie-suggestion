import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';


class AddUserMovie extends Component {
  state={
    Query:'',
    Options:[],
    Redirect:''
  }

  handleMovieChange = (event) =>{
    this.setState({Query:event.target.value});
  }

  handleSearchSubmit = (event) =>{
    event.preventDefault();
    fetch('http://www.omdbapi.com/?s='+this.state.Query+'&apikey=e0bc91cd')
    .then(res=>res.json())
    .then(res=>{
        if(res.Search !== undefined){
          this.setState({Options:res.Search})
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
       if(!res.ok){
         this.setState({Redirect:<Redirect to='/signin'/>})
       }});
  }

  render() {
    return (
      <div>
        {this.state.Redirect}
        <h3>{this.state.User}</h3>
        <form onSubmit={this.handleSearchSubmit}>
          <label>
            Find Movie:
            <input
                  type="text"
                  value={this.state.Movie}
                  onChange={this.handleMovieChange}/>
          </label>
          <input
                 type="submit"
                 value="Submit"/>
        </form>
        {this.state.Options.map(mov=>(
          <div>
          <p>{mov.Title} {mov.Year}</p>
          <button onClick={()=>this.handleAddMovie(mov.Title, mov.Year)}>Add</button>
          </div>
        ))}
      </div>
    );
  }
}

export default AddUserMovie;
