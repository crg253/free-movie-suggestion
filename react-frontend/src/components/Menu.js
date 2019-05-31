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
    res.json()
     .then(res=>{
       this.props.setUser('')
       this.props.setMovies(res.movies)
      })
  })
}


  render() {

    let randomMovies= this.props.getRandomMovies()

    let signInOutLink = ''
    if(this.props.user.length === 0){
      signInOutLink= <div onClick={()=>this.changeMenuDisplay()}>
                        <Link to={'/signin'}>
                          <h4 className="menu-links">Sign In</h4>
                        </Link>
                      </div>
    }else{
      signInOutLink= <button
                          className='button-nostyle'
                          onClick={()=>{
                              this.handleSignOut();
                              this.changeMenuDisplay();}}>
                          <h4
                            className="menu-links">Sign Out</h4>
                          </button>
    }

    let savedMovieLink =''
    if (this.props.movies.length>0){
      savedMovieLink=
      <div onClick={()=>{
          this.changeMenuDisplay();
          this.props.chooseListBy('Saved');
          this.props.setIndexes(8,9,0)}}>
        <Link to={'/'+ randomMovies['Saved'].slug}>
          <h4 className="menu-links">SAVED</h4>
        </Link>
      </div>

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

            <div onClick={()=>this.changeMenuDisplay()}>
              <h4 id="menu-user">{this.props.user}</h4>
            </div>

              {signInOutLink}

            <div onClick={()=>this.changeMenuDisplay()}>
              <Link to={'/recommend'}>
                <h4 className="menu-links">Recommend</h4>
              </Link>
            </div>

            <div>
              <button
                className="button-nostyle"
                onClick={()=>{this.changeMenuDisplay();}}>
                    <h2 className="menu-genre-links">User Suggestions</h2>
              </button>
            </div>

            <div onClick={()=>this.changeMenuDisplay()}>
              <Link to={'/'+this.props.lastMovie}>
                <h4 className="menu-links">LIST</h4>
              </Link>
            </div>

            {savedMovieLink}


          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
