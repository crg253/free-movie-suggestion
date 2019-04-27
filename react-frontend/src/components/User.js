import React, { Component } from 'react';

class User extends Component {

  state={
    User:""
  }

  componentDidMount(){
    fetch('/api/user', {
     method: 'GET',
     headers: {'Authorization':"Bearer " +localStorage.getItem('token')},
    })
    .then(res=>res.json())
    .then(data => this.setState({User:data.user}))
  }

  render() {

    return (
      <div>{this.state.User}</div>
    );
  }
}

export default User;
