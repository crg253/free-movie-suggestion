import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';

import './User.css';
class User extends Component {

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

  componentDidMount(){
    fetch('api/checktoken',{
      method:'POST',
      headers:{
        'Authorization':"Bearer " +localStorage.getItem('token')
    }})
    .then(res=>{
      if(!res.ok){
        this.setState({Redirect:<Redirect to='/signin'/>})
      }});
  }


  render() {
    return (
      <div>
        {this.state.Redirect}
        <Link to={'/'}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>
        <div style={{textAlign:'center'}}>
          <h3>{this.state.User}</h3>
          <form onSubmit={this.handleSearchSubmit}>
            <label style={{display:"block"}}>
              Find Movie:
              <input style={{
                          display:"block",
                          marginLeft:"auto",
                          marginRight:"auto"}}
                    type="text"
                    value={this.state.Movie}
                    onChange={this.handleMovieChange}/>
            </label>
            <input style={{
                        display:"block",
                        marginLeft:"auto",
                        marginRight:"auto"}}
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
      </div>
    );
  }
}

export default User;
