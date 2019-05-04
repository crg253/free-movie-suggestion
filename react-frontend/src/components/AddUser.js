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
             <Link to={'/signin'}>sign in</Link>
          </form>
        </div>
      </div>
    );
  }
}

export default AddUser;
