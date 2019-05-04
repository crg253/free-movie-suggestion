import React, { Component } from 'react';
import { Link } from "react-router-dom";

import './User.css';
class SignIn extends Component  {
  state={
    name:'',
    password:''
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
    .then(res=>localStorage.setItem('token', res.token))
  }

  render() {
    return (
      <div>
        <Link to={'/'}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>
        <div style={{textAlign:'center'}}>
          <form onSubmit={this.handleSubmit}>

            <label style={{display:"block"}}>
              Name:
              <input style={{
                          display:"block",
                          marginLeft:"auto",
                          marginRight:"auto"}}
                      type="text"
                      value={this.state.name}
                      onChange={this.handleNameChange} />
            </label>

            <label style={{display:"block"}}>
              Password:
              <input style={{
                          display:"block",
                          marginLeft:"auto",
                          marginRight:"auto"}}
                     type="text"
                     value={this.state.password}
                     onChange={this.handlePasswordChange}/>
            </label>

            <input style={{
                        display:"block",
                        marginLeft:"auto",
                        marginRight:"auto"}}
                   type="submit"
                   value="Submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default SignIn;
