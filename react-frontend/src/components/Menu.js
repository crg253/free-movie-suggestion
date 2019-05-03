import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Menu.css';


class Menu extends Component {
  state={
    displayButton:'inline',
    displayMenu:'none'
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

  render() {
    return (
      <div>
        <div
          id="menu-button"
          style={{display:this.state.displayButton}}
          onClick={()=>this.changeMenuDisplay()}>
          MENU
        </div>
        <div
          id="open-menu"
          style={{display:this.state.displayMenu}}
          onClick={()=>this.changeMenuDisplay()}>

          <Link to={'/adduser'}>Sign Up</Link>
          <Link to={'/signin'}>Sign In</Link>
          <Link to={'/user' }>Contribute</Link>
        </div>
      </div>
    );
  }
}

export default Menu;
