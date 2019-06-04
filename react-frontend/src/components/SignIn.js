import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";


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
    fetch('/api/signin',{
      method:'POST',
      headers: headers
    })
    .then(res=>{
      if (res.status===401) {
        this.setState({name:'', password:''})
      }else if (res.status===200){
        res.json()
        .then(res=>{
          localStorage.setItem('token', res.token)
          this.props.setUser(res.user)
          this.props.setMovies(res.movies)
          if(this.props.redirectBackGenre.length >0){
            this.props.setRedirectBack(<Redirect to={'/'+ this.props.redirectBackGenre + '/'+ this.props.redirectBackSlug}/>)
          }else if(this.props.redirectBackSlug.length>0){
            this.props.setRedirectBack(<Redirect to={'/'+ this.props.redirectBackSlug}/>)
          }else{
            this.setState({name:'', password:'',Message:"Now signed in as "+ res.user})
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
            <h4>{this.state.Message}</h4>
            <Link to={'/adduser'}><h3>create account</h3></Link>
          </div>{/*class="user-pages-body-wrapper"*/}
        </div>
    );
  }
}

export default SignIn;
