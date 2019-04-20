import React, { Component } from 'react';
import axios from 'axios';

class AllUsers extends Component  {
  state={
    Users:[]
  }
  componentDidMount(){
      axios.get('/api/allusers')
      .then(response=> {
        this.setState({Users: response.data})
      })
  }
  render() {
    return (
      <div>
      {this.state.Users.map(user=><h3>{user.username}</h3>)}
      </div>
    );
  }
}

export default AllUsers;
