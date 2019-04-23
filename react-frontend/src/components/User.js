import React, { Component } from 'react';
import axios from 'axios';

class User extends Component  {
  state={
    User:'',
    Movies:[],
    NewMovie:''
  }
  componentDidMount(){
      axios.get('/api/user')
      .then(response=> {
        this.setState({User: response.data.username, Movies:response.data.movies})
      })
  }

  handleMovieChange = (event) =>{
    this.setState({NewMovie:event.target.value});
  }

  handleSubmit = (event) =>{
    event.preventDefault();
    fetch('/api/user', {
     method: 'POST',
     headers: {'Content-Type':'application/json'},
     body: JSON.stringify({NewMovie: this.state.NewMovie})
    }).then(res=>console.log(res))
  };


  render() {
    return (
      <div>
      <h2>{this.state.User}</h2>
      {this.state.Movies}
      <form onSubmit={this.handleSubmit}>

        <label>
          Add Movie:
          <input type="text" value={this.state.NewMovie} onChange={this.handleMovieChange} />
        </label>

        <input type="submit" value="Submit" />
      </form>
      </div>
    );
  }
}

export default User;
