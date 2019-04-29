import React, { Component } from 'react';

class User extends Component {

  state={
    User:'',
    Query:'',
    Options:[]
  }

  handleMovieChange = (event) =>{
    this.setState({Query:event.target.value});
  }

  componentDidMount(){
    fetch('/api/user', {
     method: 'GET',
     headers: {'Authorization':"Bearer " +localStorage.getItem('token')},
    })
    .then(res=>res.json())
    .then(data => this.setState({User:data.user}))
  }

  handleSubmit = (event) =>{
    console.log(this.state.Query)
    event.preventDefault();
    fetch('http://www.omdbapi.com/?s='+this.state.Query+'&apikey=e0bc91cd')
    .then(res=>res.json())
    .then(res=>this.setState({Options:res.Search}));
  }

  render() {
    console.log(this.state.Options)
    return (
      <div>
      <h3>{this.state.User}</h3>
      <form onSubmit={this.handleSubmit}>
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
