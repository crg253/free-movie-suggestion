import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Menu.css';

class Menu extends Component {
  state={
    displayButton:'inline',
    displayMenu:'none',
  }

  changeMenuDisplay = () =>{
    if(this.state.displayButton==='inline'){
      this.setState({displayButton:'none'})
      this.setState({displayMenu:'inline'})
    }else{
      this.setState({displayButton:'inline'})
      this.setState({displayMenu:'none'})
    }
  }

  handleSignOut = () =>{
  fetch('/api/revoketoken', {
    method:'DELETE',
    headers:{
      'Authorization':'Bearer ' +localStorage.getItem('token')
    }
  })
  .then(res=>{
    res.json()
     .then(res=>{
       this.props.setUser('')
       this.props.setMovies(res.movies)
      })
    })
  }


  render() {

    let currentUserLink = ''
    if(this.props.user.length >0){
      currentUserLink =   <div onClick={()=>this.changeMenuDisplay()}>
                            <Link to={'/usermovies'}>
                              <h4 id='menu-user'>{this.props.user + "'s Movies"}</h4>
                            </Link>
                          </div>
    }

    let signInOutLink = ''
    if(this.props.user.length === 0){
      signInOutLink= <div onClick={()=>this.changeMenuDisplay()}>
                        <Link to={'/signin'}>
                          <h4 className='menu-links'>Sign In</h4>
                        </Link>
                      </div>
    }else{
      signInOutLink= <button
                          className='button-nostyle'
                          onClick={()=>{
                              this.handleSignOut();
                              this.changeMenuDisplay();}}>
                          <h4
                            className='menu-links'>Sign Out</h4>
                          </button>
    }

    return (
      <div>

        <button
          id='menu-button'
          className='button-nostyle'
          style={{display:this.state.displayButton}}
          onClick={()=>this.changeMenuDisplay()}></button>

        <div
          id='open-menu'
          style={{display:this.state.displayMenu}}>

          <button
            id='close-menu-button'
            className='button-nostyle'
            onClick={()=>this.changeMenuDisplay()}>X</button>


            <div id='menu-links'>

            {currentUserLink}
            {signInOutLink}

            <div onClick={()=>this.changeMenuDisplay()}>
              <Link to={'/recommend'}>
                <h4 className='menu-links'>Recommend</h4>
              </Link>
            </div>

            <div onClick={()=>this.changeMenuDisplay()}>
              <Link to={'/usersuggestions'}>
                <h4 className='menu-links'>User Suggestions</h4>
              </Link>
            </div>


          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
