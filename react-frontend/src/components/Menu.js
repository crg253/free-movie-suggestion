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

  handleSignOut = (event) =>{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    this.props.handleFetch('revoketoken',headers,'', )
  }


  render() {
    let signInLink=
                      <Link to={'/signin'}>
                        <h4 className="menu-genre-links">Sign In</h4>
                      </Link>

    let signOutLink= <button
                        className='button-nostyle'
                        onClick={()=>{
                            this.handleSignOut();
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

              <Link to={'/recommend'}>
                <h4 className="menu-genre-links">Recommend</h4>
              </Link>

              <div onClick={()=>this.props.chooseListBy("All")}>
                <Link to={'/movielist'}>
                  <h4 className="menu-genre-links">Movies</h4>
                </Link>
              </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
