import React, { Component } from 'react';
import { Link, Redirect} from 'react-router-dom';

import './UserForm.css';

class DeleteAccount extends Component {

  state={
    Name:"",
    Password:"",
    Message:"",
    ErrorMessage:""
  }

  handleNameChange = (event) =>{
    this.setState({
      Name:event.target.value,
      Message:"",
      ErrorMessage:""
    });
  }
  handlePasswordChange = (event) =>{
    this.setState({
      Password:event.target.value,
      Message:"",
      ErrorMessage:""
    });
  }


  handleDeleteAccount = (event)=>{
    let headers = new Headers();
    headers.set(
      'Authorization','Basic '+ Buffer.from(this.state.Name +':'+this.state.Password).toString('base64')
    );
    event.preventDefault();
    fetch('/api/deleteaccount',{
      method:'DELETE',
      headers: headers
    })
    .then(res=>{
      if (res.status===401) {
       this.setState({
         Name:'',
         Password:'',
         ErrorMessage:<p style={{fontSize:'18px',color:'red'}}>Incorrect username or password</p>
       })
      }
      else if (res.status===200){
        this.props.setUser('')
        this.props.setEmail('')
        this.props.handleGetMovies('')
        this.setState({
          Name:'',
          Email:'',
          Password:'',
          Message:<p style={{fontSize:'18px'}}>Account Deleted</p>
        })
       }
    })
  }


  render() {

    return (
      <div >
        {this.props.redirect}

        <Link to={'/'}>
          <h1 id='main-title'>FREE MOVIE SUGGESTION</h1>
        </Link>

        <div className='user-pages-body-wrapper'>
        <h1>Delete Account</h1>


          <div >
          <form onSubmit = {this.handleDeleteAccount}>
              <input
                 type='text'
                 placeholder='Username'
                 value={this.state.Name}
                 onChange={this.handleNameChange}
              />
              <input
                 type='text'
                 placeholder='Password'
                 value={this.state.Password}
                 onChange={this.handlePasswordChange}
              />
              <input
                 type='submit'
                 value='Delete'
                 style={{backgroundColor:'#B22222'}}
                 className='form-submit-button'
             />
            </form>
            {this.state.Message}
            {this.state.ErrorMessage}
          </div>
        </div>
        <div className='form-footer'></div>
      </div>
    );
  }
}

export default DeleteAccount;
