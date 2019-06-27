import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './UserForm.css';

class ResetPassword extends Component {
  state={
    Email:"",
    Message:"",
    ErrorMessage:""
  }

  handleEmailChange = (event) =>{
    this.setState({
      Email:event.target.value,
      Message:"",
      ErrorMessage:""
    })
  }

  handlePasswordReset = (event) => {
    event.preventDefault();
    fetch('/api/resetpassword',{
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({email:this.state.Email})
    })
    .then(res=>{
      if(!res.ok){
        this.setState({
          ErrorMessage:<p style={{fontSize:'18px',color:'red'}}>Sorry, email not found.</p>,
          Email:""})
      }else{
        this.setState({
          Message:<p style={{fontSize:'18px',color:'white'}}>Success. Check email for new password.</p>,
          Email:""})
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
          <h1>Reset Password</h1>
          <form
            onSubmit = {this.handlePasswordReset}>

            <input
               type='text'
               placeholder='Email'
               value={this.state.Email}
               onChange={this.handleEmailChange}
            />
            <input
                 type='submit'
                 value='Submit'
                 className='form-submit-button'
             />

             {this.state.ErrorMessage}
             {this.state.Message}
            </form>

          <Link to={'/signin'}><h1>/sign<span style={{color:'#a9a9a9'}}>in</span></h1></Link>
        </div>{/* class="user-pages-body-wrapper"*/}
        <div className='form-footer'></div>
      </div>
    );
  }
}

export default ResetPassword;
