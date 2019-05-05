import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';

import './User.css';
import AddUserMovie from "./AddUserMovie";
import UserMovies from "./UserMovies";

class User extends Component {

  state={
    Redirect:''
  }

  componentDidMount(){
    fetch('api/checktoken',{
      method:'POST',
      headers:{
        'Authorization':"Bearer " +localStorage.getItem('token')
    }})
    // .then(res=>{
    //   if(!res.ok){
    //     this.setState({Redirect:<Redirect to='/signin'/>})
    //   }});
  }

  handleSignOut = () =>{
    fetch('api/revoketoken', {
      method:'DELETE',
      headers:{
        'Authorization':"Bearer " +localStorage.getItem('token')
      }
    })
    .then(res=>{
      this.setState({Redirect:<Redirect to='/signin'/>})
    })
  }

  render() {
    return (
      <div className='user-pages-body-wrapper'>
        {this.state.Redirect}
        <Link to={'/'}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>
        <AddUserMovie/>
        {/*<UserMovies/>*/}
        <a href='javascript:void(0);' onClick={()=>this.handleSignOut()}>sign out</a>
      </div>
    );
  }
}

export default User;
