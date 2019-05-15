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


  render() {
    let signInLink=
                      <Link to={'/signin'}>
                        <h4 className="menu-genre-links">Sign In</h4>
                      </Link>

    let signOutLink= <button
                        className='button-nostyle'
                        onClick={()=>{
                            this.props.handleTokenFetch('revoketoken', '');
                            this.changeMenuDisplay();}}>
                        <h4
                          className="menu-genre-links">Sign Out</h4>
                        </button>
    return (
      <div>

        <button
          id="menu-button"
          className="button-nostyle"
          style={{display:this.state.displayButton}}
          onClick={()=>this.changeMenuDisplay()}></button>

        <div
          id="open-menu"
          style={{display:this.state.displayMenu}}>

          <button
            id="close-menu-button"
            className="button-nostyle"
            onClick={()=>this.changeMenuDisplay()}>X</button>


            <div id="menu-links">

              {signInLink}
              {signOutLink}

          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
