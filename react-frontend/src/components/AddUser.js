import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './UserForm.css';
class AddUser extends Component {
  state={
    Name:"",
    Password:"",
    Email:"",
    Message:""
  }
  handleNameChange = (event) =>{
    this.setState({Name:event.target.value});
  }
  handlePasswordChange = (event) =>{
    this.setState({Password:event.target.value})
  }
  handleEmailChange = (event) =>{
    this.setState({Email:event.target.value})
  }

  handleAddUserSubmit = (event) =>{
    event.preventDefault();
    fetch('/api/adduser', {
     method: 'POST',
     headers: {'Content-Type':'application/json'},
     body: JSON.stringify({userName: this.state.Name, password:this.state.Password})
    })
    .then(res=>{
      if(!res.ok){
        this.setState({Message:"Username not available", Name:"", Password:""})
      }else{
        this.setState({Message:"Thank you for signing up.", Name:"", Password:""})

      }
    })
}


  render() {
    return (
      <div>
        <Link to={'/'}>
          <h1 id='main-title'>FREE MOVIE SUGGESTION</h1>
        </Link>
        <div className='user-pages-body-wrapper'>
          <h1>Create Account</h1>
          <form onSubmit={this.handleAddUserSubmit}>

            <label>
              Name:
              <input
                 type='text'
                 value={this.state.Name}
                 onChange={this.handleNameChange}
              />
            </label>

            <label>
              Password:
              <input
                 type='text'
                 value={this.state.Password}
                 onChange={this.handlePasswordChange}
              />
            </label>

            <label>
              Email:
              <input
                 type='text'
                 value={this.state.Email}
                 onChange={this.handleEmailChange}
              />
            </label>
            <input
                 type='submit'
                 value='Submit' />
            </form>


          <h4>{this.state.Message}</h4>
          <Link to={'/signin'}><h3>sign in</h3></Link>
        </div>{/* class="user-pages-body-wrapper"*/}
      </div>
    );
  }
}

export default AddUser;
