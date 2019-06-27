import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import './UserForm.css';
import './SignIn.css';

class SignIn extends Component  {
  state={
    Name:"",
    Password:"",
    MessageLink:"",
    ErrorMessage:"",
  }

  handleNameChange = (event) =>{
    this.setState({
      Name:event.target.value,
      MessageLink:"",
      ErrorMessage:"",
    });
  }
  handlePasswordChange = (event) =>{
    this.setState({
      Password:event.target.value,
      MessageLink:"",
      ErrorMessage:"",

    })
  }

  handleSignInSubmit = (event) =>{
    let headers = new Headers();
    headers.set(
      'Authorization','Basic '+ Buffer.from(this.state.Name +':'+this.state.Password).toString('base64')
    );
    event.preventDefault();
    fetch('/api/signin',{
      method:'POST',
      headers: headers
    })
    .then(res=>{
      if (res.status===401) {
        this.setState({
          Name:"",
          Password:"",
          ErrorMessage:<p style={{fontSize:'18px',color:'red'}}>Incorrect username or password</p>
        })
      }else if (res.status===200){
        res.json()
        .then(res=>{
          localStorage.setItem('token', res.token)
          this.props.setUser(res.user)
          this.props.setEmail(res.email)
          this.props.setMovies(res.movies)
          if(this.props.redirectBackGenre.length >0){
            this.props.setRedirectBack(<Redirect to={'/'+ this.props.redirectBackGenre + '/'+ this.props.redirectBackSlug}/>)
          }else if(this.props.redirectBackSlug.length>0){
            this.props.setRedirectBack(<Redirect to={'/'+ this.props.redirectBackSlug}/>)
          }else{
            this.setState({
              Name:"",
              Password:"",
              MessageLink:<p style={{fontSize:'18px',color:'white'}}>Now signed in as {res.user}</p>,
            })
          }
         })
      }
    })
  }

  componentDidMount(){
    this.props.setRedirect('')
  }

  componentWillUnmount(){
    this.props.setRedirectBack('')
    this.props.setRedirectBackSlug('')
    this.props.setRedirectBackGenre('')
  }

  render() {
    return (
        <div>
        {this.props.redirectBack}
          <Link to={'/'}>
            <h1 id='main-title'>FREE MOVIE SUGGESTION</h1>
          </Link>
          <div className='user-pages-body-wrapper'>
          <h1>Sign In</h1>
            <form onSubmit={this.handleSignInSubmit}>

              <input
                type='text'
                placeholder='Name'
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
                 value='Submit'
                 className='form-submit-button'
              />

             {this.state.ErrorMessage}
             {this.state.MessageLink}
            </form>

            <div id='forgotpassword-createaccount-links'>

              <Link to={'/resetpassword'}>
                <h1 id='resetpassword-link'>forgot password?</h1>
              </Link>

              <Link to={'/createaccount'}>
                  <h1 id='createaccount-link'>
                    /create
                    <span id='account-word-style'>account</span>
                  </h1>
              </Link>
            </div>
          </div>{/*class="user-pages-body-wrapper"*/}
          <div className='form-footer'></div>
        </div>
    );
  }
}

export default SignIn;
