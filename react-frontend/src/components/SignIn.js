import React, { Component } from 'react';
import axios from 'axios';

class SignIn extends Component  {

  componentDidMount(){
      axios.get('/api/signin')
      .then(response=> {
        localStorage.setItem('token', response.data.token)
      })
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

export default SignIn;
