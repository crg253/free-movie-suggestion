import React, { Component } from 'react';

class User extends Component {

  state={
    Query:'',
    Options:[]
  }

  handleMovieChange = (event) =>{
    this.setState({Query:event.target.value});
  }

  handleSearchSubmit = (event) =>{
    console.log(this.state.Query)
    event.preventDefault();
    fetch('http://www.omdbapi.com/?s='+this.state.Query+'&apikey=e0bc91cd')
    .then(res=>res.json())
    .then(res=>this.setState({Options:res.Search}));
  }

  // HANDLE THE OTHER SUBMIT
  // fetch('api/checktoken',{
  //   method:'GET',
  //   headers:{'Authorization':"Bearer " +localStorage.getItem('token')}
  // })
  // .then(res=>res.json())
  // .then(data=>this.props.setUser(data.user))


  render() {

    return (
      <div>
      <h3>{this.state.User}</h3>
      <form onSubmit={this.handleSearchSubmit}>
        <label>
          Add Movie:
          <input type="text" value={this.state.Movie} onChange={this.handleMovieChange}/>
        </label>
        <input type="submit" value="Submit"/>
      </form>
      {this.state.Options.map(mov=>(
        <div>
        <p>{mov.Title} {mov.Year}</p>
        <button>Add</button>
        </div>
      ))}
      </div>
    );
  }
}

export default User;
