import React, { Component } from 'react';
import axios from 'axios';

class SignIn extends Component  {
  state={
    Token:''
  }
  componentDidMount(){
      axios.get('/api/signin')
      .then(response=> {
        localStorage.setItem('token', response.data.token)
      })
  }

  render() {
    return (
      <div>
      {this.state.Token}
      </div>
    );
  }
}

export default SignIn;
