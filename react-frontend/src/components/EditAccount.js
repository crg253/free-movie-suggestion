import React, { Component } from 'react';
import { Link, Redirect} from 'react-router-dom';

import './UserForm.css';

class EditAccount extends Component {

  state={
    NewName:"",
    NewEmail:"",
    NewPassword:"",
    Message:""
  }

  handleNewNameChange = (event) =>{
    this.setState({
      NewName:event.target.value,
    });
  }
  handleNewEmailChange = (event) =>{
    this.setState({
      NewEmail:event.target.value,
    });
  }
  handleNewPasswordChange = (event) =>{
    this.setState({
      NewPassword:event.target.value,
    });
  }


  handleUpdateAccount = (event)=>{
    event.preventDefault();
    fetch('/api/updateaccount',{
      method:'POST',
      headers:{
         'Authorization':'Bearer ' +localStorage.getItem('token'),
         'Content-Type':'application/json'
       },
      body: JSON.stringify({
        newUserName:this.state.NewName,
        newEmail:this.state.NewEmail,
        newPassword:this.state.NewPassword
        })
    })
    .then(res=>{
      if (res.status===401) {
      res.json()
       .then(res=>{
         this.props.setUser(res.user)
         this.props.setEmail(res.email)
         this.props.setMovies(res.movies)
         this.props.setRedirectBack('')
         this.props.setRedirectBackSlug('recommend')
         this.props.setRedirect(<Redirect to='/signin'/>)
         this.setState({
           NewName:'',
           NewEmail:'',
           NewPassword:''
         })
      })
    }
    else if (res.status===200){
      res.json()
        .then(res=>{
          this.props.setUser(res.user)
          this.props.setEmail(res.email)
          this.props.setMovies(res.movies)
          this.setState({
            NewName:'',
            NewEmail:'',
            NewPassword:'',
            Message:<p style={{fontSize:'18px'}}>Account Updated</p>
          })
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
        <h1>Edit Account</h1>


          <div >
          <form onSubmit = {this.handleUpdateAccount}
                style={{textAlign:'center'}}>
              <input
                 type='text'
                 placeholder={this.props.user}
                 value={this.state.NewName}
                 onChange={this.handleNewNameChange}
              />
              <input
                 type='text'
                 placeholder={this.props.email}
                 value={this.state.NewEmail}
                 onChange={this.handleNewEmailChange}
              />
              <input
                 type='text'
                 placeholder='New Password'
                 value={this.state.NewPassword}
                 onChange={this.handleNewPasswordChange}
              />
            <input
                 type='submit'
                 value='Update'
                 className='form-submit-button'
             />
            </form>
            {this.state.Message}
          </div>
        </div>
        <div className='form-footer'></div>
      </div>
    );
  }
}

export default EditAccount;
