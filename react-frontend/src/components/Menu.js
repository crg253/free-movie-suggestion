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
    .then(res=>{
      this.props.setUser('')
      this.props.setSavedMovies([])
    }

    )
  }

  render() {

    let userMoviesLink = ''
    if(this.props.user !==''){
      userMoviesLink= <div onClick={()=>{this.changeMenuDisplay();}}>
                      <Link to={'/usermovies'}>
                        <h4 className="menu-genre-links">Your Movies</h4>
                      </Link>
                    </div>
    }

    let signOutLink = ''
    if(this.props.user !==''){
      signOutLink= <div onClick={()=>{this.handleSignOut();this.changeMenuDisplay();}}>
                      <Link to={'/'}>
                        <h4 className="menu-genre-links">Sign Out</h4>
                      </Link>
                    </div>
    }

    let menuGenreLinks = ''
    const userPaths = ['/user', '/usermovies', '/signin', '/adduser']
    if (userPaths.includes(this.props.location.pathname)){
      menuGenreLinks = this.props.genres.map(genre=>(
                <div
                  key={"menu" + genre}
                  onClick={()=>{this.props.chooseListBy(genre);this.changeMenuDisplay();}}>
                  <Link to={'/' + this.props.randomMovies[genre].slug}>
                    <p className="menu-genre-links">{genre} </p>
                  </Link>
                </div>
      ))
    }


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
              <h4 className="menu-genre-links">{this.props.user}</h4>

              {userMoviesLink}

              <div onClick={()=>this.changeMenuDisplay()}>
                <Link to={'/user'}>
                  <h4 className="menu-genre-links">Contribute</h4>
                </Link>
              </div>
              {signOutLink}

              <div onClick={()=>this.changeMenuDisplay()}>
                <Link to={'/'}>
                  <h4 className="menu-genre-links">Home</h4>
                </Link>
              </div>
              
              {menuGenreLinks}


          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
