import React, { Component } from 'react';
import { Link } from "react-router-dom";

import './User.css';
class AddUser extends Component {
  state={
    name:'',
    password:'',
    Message:''
  }
  handleNameChange = (event) =>{
    this.setState({name:event.target.value});
  }
  handlePasswordChange = (event) =>{
    this.setState({password:event.target.value})
  }

  handleSubmit = (event) =>{
    event.preventDefault();
    let headers = {'Content-Type':'application/json'}
    let body = JSON.stringify({userName: this.state.name, password:this.state.password})

    this.props.handleFetch('adduser',headers,body)
  }

  render() {
    return (
      <div>
        <Link to={'/'}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>
        <div className="user-pages-body-wrapper">
          <h1>Create Account</h1>
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
          {this.state.Message}
          <Link to={'/signin'}><h3>sign in</h3></Link>
        </div>{/* class="user-pages-body-wrapper"*/}
      </div>
    );
  }
}

export default AddUser;
