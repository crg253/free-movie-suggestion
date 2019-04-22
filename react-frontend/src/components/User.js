import React, { Component } from 'react';
import axios from 'axios';

class User extends Component  {
  state={
    User:''
  }
  componentDidMount(){
      axios.get('/api/user')
      .then(response=> {
        this.setState({User: response.data})
      })
  }
  render() {
    return (
      <div>
      <h3>{this.state.User}</h3>
      </div>
    );
  }
}

export default User;
