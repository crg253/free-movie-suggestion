import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";

import './User.css';
class SignIn extends Component  {
  state={
    name:'',
    password:'',
    Redirect:''
  }
  handleNameChange = (event) =>{
    this.setState({name:event.target.value});
  }
  handlePasswordChange = (event) =>{
    this.setState({password:event.target.value})
  }

  handleSubmit = (event) =>{
    let headers = new Headers();
    headers.set(
      'Authorization','Basic '+ Buffer.from(this.state.name +":"+this.state.password).toString('base64')
    );
    event.preventDefault();
    fetch('api/signin',{
      method:'POST',
      headers: headers
    })
    .then(res=>res.json())
    .then(res=>{
        localStorage.setItem('token', res.token);
        this.setState({Redirect:<Redirect to='/user'/>})
        console.log('reroute to /user')
    })
  }

  render() {
    return (
      <div>
        {this.state.Redirect}
        <Link to={'/'}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>
        <div class="user-pages-body-wrapper">
          <form onSubmit={this.handleSubmit}>

            <label>
              Name:
              <input
                      type="text"
                      value={this.state.name}
                      onChange={this.handleNameChange} />
            </label>

            <label>
              Password:
              <input
                     type="text"
                     value={this.state.password}
                     onChange={this.handlePasswordChange}/>
            </label>

            <input
                   type="submit"
                   value="Submit" />
          </form>
          <Link to={'/adduser'}><h3>create account</h3></Link>
        </div>{/*class="user-pages-body-wrapper"*/}
      </div>
    );
  }
}

export default SignIn;
