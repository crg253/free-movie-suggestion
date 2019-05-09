import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Menu.css';

class Menu extends Component {
  state={
    displayButton:'inline',
    displayMenu:'none',
  }

  changeMenuDisplay = () =>{
    if(this.state.displayButton==="inline"){
      this.setState({displayButton:"none"})
      this.setState({displayMenu:"inline"})
    }else{
      this.setState({displayButton:'inline'})
      this.setState({displayMenu:"none"})
    }
  }

  handleSignOut = () =>{
    fetch('api/revoketoken', {
      method:'DELETE',
      headers:{
        'Authorization':"Bearer " +localStorage.getItem('token')
      }
    })
  }

  render() {


    let signOutLink = ''
    if(this.props.user !==''){
      signOutLink= <div onClick={()=>{this.handleSignOut();this.props.setUser('')}}>
                          <Link to={'/'}><h3>Sign Out</h3></Link>
                        </div>
    }


    return (
      <div>
      <a href="javascript:void(0);">
        <div
          id="menu-button"
          style={{display:this.state.displayButton}}
          onClick={()=>this.changeMenuDisplay()}>
        </div>
      </a>


      <a href="javascript:void(0);">
        <div
          id="open-menu"
          style={{display:this.state.displayMenu}}
          onClick={()=>this.changeMenuDisplay()}>

          <div id="menu-links">
            <Link to={'/'}><h3>Home</h3></Link>
            <Link to={'/user'}><h3>Contribute</h3></Link>


            {signOutLink}

            {/*
            {this.props.genres.map(genre=>(
              <div onClick={()=>this.props.selectBy(genre)}>
              <Link to={'/' + this.props.randomMovies[genre].slug}><p>{genre} </p></Link>
              </div>//Javascript Comment
            ))}
            */}
          </div>
        </div>
        </a>
      </div>
    );
  }
}

export default Menu;
