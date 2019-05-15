import React, { Component } from 'react';
import { Link } from "react-router-dom";


import './User.css';
class SignIn extends Component  {
  state={
    name:'',
    password:'',
    Message:""
  }
  handleNameChange = (event) =>{
    this.setState({name:event.target.value});
  }
  handlePasswordChange = (event) =>{
    this.setState({password:event.target.value})
  }

  handleSignInSubmit = (event) =>{
    let headers = new Headers();
    headers.set(
      'Authorization','Basic '+ Buffer.from(this.state.name +":"+this.state.password).toString('base64')
    );
    event.preventDefault();
    fetch('api/signin',{
      method:'POST',
      headers: headers
    })
    .then(res=>{
      if(res.status===401){
        this.setState({Message:"Invalid username and/or password", name:'', password:''})
      }
      res.json()
      .then(data=>{
        localStorage.setItem('token', data.token)
        this.props.setUser(data.user)
        this.props.setMovies(data.movies)
      })
    })
  }

  render() {
    return (
        <div>
          <Link to={'/'}>
            <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
          </Link>
          <div className="user-pages-body-wrapper">
          <h1>Sign In</h1>
            <form onSubmit={this.handleSignInSubmit}>

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
            {this.state.Message}
            <Link to={'/adduser'}><h3>create account</h3></Link>
          </div>{/*class="user-pages-body-wrapper"*/}
        </div>
    );
  }
}

export default SignIn;
