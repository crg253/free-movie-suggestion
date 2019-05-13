import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";


class Genres extends Component {
  state={
    displayGenreButton:'flex',
    displayGenres:'none',
    Redirect:''
  }

  changeGenreDisplay = () =>{
    if(this.state.displayGenres==="inline"){
      this.setState({displayGenres:"none"})
    }else{
      this.setState({displayGenres:'inline'})
    }
  }

  changeGenreButton = () =>{
    if(this.state.displayGenreButton==="flex"){
      this.setState({displayGenreButton:"none"})
    }else{
      this.setState({displayGenreButton:'flex'})
    }
  }

  handleGetSavedMovies = () =>{
    fetch('api/getsavedmovies',{
      method:'GET',
      headers:{
        'Authorization':"Bearer " +localStorage.getItem('token'),
      },
     })
     .then(res=>{
       if(res.status===401){
         this.props.setUser('')
         this.props.setSignInRedirect(this.props.movieslug)
         this.setState({Redirect:<Redirect to='/signin'/>})
       }else if(res.status===200){
         res.json()
           .then(res=>{
             this.props.setSavedMovies(res.savedMovies)
             this.props.setUser(res.user)
           }
         )
       }
    })
  }


  render() {
    return (
      <div>
        {this.state.Redirect}
        <div id="genre-button-or-list">

          <div id="genre-and-button" style={{display:this.state.displayGenreButton}}>
            <h2 className="select-genre" id={this.props.listBy.slice(0,3)}>{this.props.listBy}</h2>

            <button
              className="button-nostyle"
              id='get-genres-button'
              onClick={()=>{this.changeGenreDisplay();this.changeGenreButton();}}>
            </button>


          </div>{/* id= genre-and-button */}

          <div id="genre-link-list-wrapper" style={{display:this.state.displayGenres}}>

            <div id="desk-genre-link-list">
                {this.props.genres.map(genre=>(
                  <div
                    key={"desk-genre-link-list"+genre}
                    onClick={()=>this.props.chooseListBy(genre)}>
                        <Link to={'/' + this.props.randomMovies[genre].slug}>
                          <h2 id={genre.slice(0,3)}className="select-genre">{genre} </h2>
                        </Link>
                  </div>//Javascript Comment
                ))}

              <button
                className="button-nostyle"
                onClick={()=>{this.props.chooseListBy("Saved"); this.handleGetSavedMovies();}}>
                  <h2 className="select-genre">Saved</h2>
              </button>

              <button
                className="button-nostyle"
                onClick={()=>this.props.chooseListBy("All")}>
                  <h2 className="select-genre">All</h2>
              </button>

              <button
                className="button-nostyle"
                onClick={()=>this.props.chooseListBy("User Suggestions")}>
                  <h2 className="select-genre">User Suggestions</h2>
              </button>

            </div>{/* id = desk-genre-link-list */}

            <div id="mobile-genre-link-list">

                {this.props.genres.map(genre=>(
                  <div
                    key={"mobile-genre-link-list"+genre}
                    onClick={()=>{
                    this.props.chooseListBy(genre);
                    this.changeGenreDisplay();
                    this.changeGenreButton();}}>
                        <Link to={'/' + this.props.randomMovies[genre].slug}>
                          <h2 id={genre.slice(0,3)}className="select-genre">{genre} </h2>
                        </Link>
                  </div>//Javascript Comment
                ))}

              <div style={{display:'block'}}>
                <button
                  className="button-nostyle"
                  onClick={()=>{this.props.chooseListBy("Saved");
                    this.changeGenreDisplay();
                    this.changeGenreButton();}}>
                      <h2 className="select-genre">Saved</h2>
                </button>
              </div>

              <div style={{display:'block'}}>
                <button
                  className="button-nostyle"
                  onClick={()=>{this.props.chooseListBy("All");
                    this.changeGenreDisplay();
                    this.changeGenreButton();}}>
                      <h2 className="select-genre">All</h2>
                </button>
              </div>

              <div style={{display:'block'}}>
                <button
                  className="button-nostyle"
                  onClick={()=>{this.props.chooseListBy("User Suggestions");
                    this.changeGenreDisplay();
                    this.changeGenreButton();}}>
                      <h2 className="select-genre">User Suggestions</h2>
                </button>
              </div>
            </div>{/* id = mobile-genre-link-list */}


          </div>{/* id= genre-link-list-wrapper */}
        </div>{/* id= genre-button-or-list */}

        <div id="sort-by-wrapper">
          <p className='sort-selector'>sort by </p>

          <button
            style = {{
              fontSize:'16px',
              color: this.props.sortBy==='name' ? '#00FFFF': 'white'
            }}
            className='sort-selector button-nostyle'
            onClick = {()=>this.props.setSort("name")}>TITLE</button>
          <button
            style = {{
              fontSize:'16px',
              color: this.props.sortBy==='year' ? '#00FFFF': 'white'
            }}
            className='sort-selector button-nostyle'
            onClick = {()=>this.props.setSort("year")}>YEAR</button>
        </div>{/* id =sort-by wrapper */}
      </div>//Big main container
    );
  }
}

export default Genres;
