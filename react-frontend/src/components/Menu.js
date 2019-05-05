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
          <div id="menu-links">
            <Link to={'/'}><h3>Home</h3></Link>
            <Link to={'/user'}><h3>Contribute</h3></Link>

            {this.props.genres.map(genre=>(
              <div onClick={()=>this.props.selectBy(genre)}>
              <Link to={'/' + this.props.randomMovies[genre].slug}><p>{genre} </p></Link>
              </div>//Javascript Comment
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
