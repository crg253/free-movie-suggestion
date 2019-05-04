import React, { Component } from 'react';
import { Link } from "react-router-dom";

import './User.css';
class AddUser extends Component {
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
    event.preventDefault();
    fetch('/api/adduser', {
     method: 'POST',
     headers: {'Content-Type':'application/json'},
     body: JSON.stringify({userName: this.state.name, password:this.state.password})
    })
    .then(res=>res.json())
    .then(res=>console.log(res))
  }

  render() {
    return (
      <div>
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
          <Link to={'/signin'}><h3>sign in</h3></Link>
        </div>{/* class="user-pages-body-wrapper"*/}
      </div>
    );
  }
}

export default AddUser;
