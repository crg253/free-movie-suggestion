import React, { Component } from 'react';
import { Link } from "react-router-dom";

import './UserForm.css';
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

  handleAddUserSubmit = (event) =>{
  event.preventDefault();
  fetch('/api/adduser', {
   method: 'POST',
   headers: {'Content-Type':'application/json'},
   body: JSON.stringify({userName: this.state.name, password:this.state.password})
  })
  .then(res=>{
    if(!res.ok){
      this.setState({Message:"Username not available", name:'', password:''})
    }else{
      this.setState({Message:"Thank you for signing up.", name:'', password:''})

    }
  })
}


  render() {
    return (
      <div>
        <Link to={'/'}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>
        <div className="user-pages-body-wrapper">
          <h1>Create Account</h1>
          <form onSubmit={this.handleAddUserSubmit}>
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
          <h4>{this.state.Message}</h4>
          <Link to={'/signin'}><h3>sign in</h3></Link>
        </div>{/* class="user-pages-body-wrapper"*/}
      </div>
    );
  }
}

export default AddUser;
