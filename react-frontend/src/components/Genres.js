import React, { Component } from 'react';
import { Link } from "react-router-dom";


class Genres extends Component {
  state={
    displayGenreButton:'flex',
    displayGenres:'none',
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


  render() {

    return (
      <div>
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

          {/********** DESKTOP LANDSCAPE GENRE LIST CONFIGURATION ***********/}
            <div id="desk-genre-link-list">
                {this.props.genres.map(genre=>(
                  <div
                    key={"desk-genre-link-list"+genre}
                    onClick={()=>this.props.chooseListBy(genre)}>
                        <Link to={'/' + this.props.randomMovies[genre].slug}>
                          <h2
                          style = {{
                            color: this.props.listBy===genre ? 'white': '#9E9E9E'
                          }}
                          id={genre.slice(0,3)}
                          className="select-genre">{genre} </h2>
                        </Link>
                  </div>
                ))}
              <button
                className="button-nostyle"
                onClick={()=>{
                  this.props.chooseListBy("Saved");
                  this.props.handleGetSavedMovies(this.props.movieslug);}}>
                  <h2
                  style = {{
                    color: this.props.listBy==="Saved" ? 'white': '#9E9E9E'
                  }}
                   className="select-genre">Saved</h2>
              </button>
              <button
                className="button-nostyle"
                onClick={()=>this.props.chooseListBy("All")}>
                  <h2
                  style = {{
                    color: this.props.listBy==="All" ? 'white': '#9E9E9E'
                  }}
                  className="select-genre">All Movies</h2>
              </button>
              <button
                className="button-nostyle"
                onClick={()=>this.props.chooseListBy("User Suggestions")}>
                  <h2
                  style = {{
                    color: this.props.listBy==="User Suggestions" ? 'white': '#9E9E9E'
                  }}
                  className="select-genre">User Suggestions</h2>
              </button>
            </div>{/* id = desk-genre-link-list */}


            {/********* MOBILE PORTRAIT GENRE LIST CONFIGURATION ************/}
            <div id="mobile-genre-link-list">
                {this.props.genres.map(genre=>(
                  <div
                    key={"mobile-genre-link-list"+genre}
                    onClick={()=>{
                      this.props.chooseListBy(genre);
                      this.changeGenreDisplay();
                      this.changeGenreButton();}}>
                        <Link to={'/' + this.props.randomMovies[genre].slug}>
                          <h2
                            id={genre.slice(0,3)}
                            className="select-genre">{genre} </h2>
                        </Link>
                  </div>//Javascript Comment
                ))}
              <div style={{display:'block'}}>
                <button
                  className="button-nostyle"
                  onClick={()=>{this.props.chooseListBy("Saved");
                                  this.props.handleGetSavedMovies(this.props.movieslug);
                                  this.changeGenreDisplay();
                                  this.changeGenreButton();
                                  }}>
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


        {/************** SORT BY BUTTONS *****************/}

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
