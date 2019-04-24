import React, { Component } from 'react';
import axios from 'axios';

class User extends Component  {
  state={
    User:'',
    Movies:[],
    Token:''
  }
  componentDidMount(){
      axios.get('/api/user')
      .then(response=> {
        this.setState({
          User: response.data.username,
          Movies:response.data.movies,
          Token: response.data.token})
      })
  }

  render() {
    return (
      <div>
      <h2>{this.state.User}</h2>
      {this.state.Movies}
      {this.state.Token}
      </div>
    );
  }
}

export default User;
