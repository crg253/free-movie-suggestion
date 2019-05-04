import React, { Component } from 'react';


class UserMovies extends Component {

  state={
    UserMovies:[]
  }

  componentDidMount(){
    fetch('api/usermovies',{
      method:'GET',
      headers:{
        'Authorization':"Bearer " +localStorage.getItem('token')
    }})
    .then(res=>res.json())
    .then(res=>this.setState({UserMovies:res}))
  }


  render() {
    return (
      <div>
      {this.state.UserMovies.map(film =><h1>{film.name}</h1>)}
      </div>
    );
  }
}

export default UserMovies;
