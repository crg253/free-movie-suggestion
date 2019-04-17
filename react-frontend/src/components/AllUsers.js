import React, { Component } from 'react';
import axios from 'axios';

class AllUsers extends Component  {
  state={
    Users:[]
  }
  componentDidMount(){
      axios.get('http://127.0.0.1:5000/api/allusers')
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
