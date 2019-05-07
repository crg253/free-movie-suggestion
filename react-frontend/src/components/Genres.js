import React, { Component } from 'react';
import { Link } from "react-router-dom";


class genres extends Component {
  state={
    displayGenreButton:'flex',
    displayGenres:'none'
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
            <h2 class="select-genre" id={this.props.listby.slice(0,3)}>{this.props.listby}</h2>
            <a href="javascript:void(0);">
              <div
                id='get-genres-button'
                onClick={()=>{this.changeGenreDisplay();this.changeGenreButton();}}>
              </div>{/* id='get-genres-button'*/}
            </a>{/* Button */}
          </div>{/* id= genre-and-button */}

          <div id="genre-link-list-wrapper" style={{display:this.state.displayGenres}}>
            <div id="genre-link-list">

                {this.props.genres.map(genre=>(
                  <div
                    onClick={()=>{
                    this.props.selectBy(genre);
                    this.changeGenreDisplay();
                    this.changeGenreButton();}}>
                        <Link to={'/' + this.props.randomMovies[genre].slug}>
                          <h2 id={genre.slice(0,3)}class="select-genre">{genre} </h2>
                        </Link>
                  </div>//Javascript Comment
                ))}

              <a
                href="javascript:void(0);"
                onClick={()=>{this.props.selectBy("Saved");this.changeGenreDisplay();this.changeGenreButton();}}>
                <h2 class="select-genre">Saved</h2>
              </a>

              <a href="javascript:void(0);"
                onClick={()=>{this.props.selectBy("All");this.changeGenreDisplay();this.changeGenreButton();}}>
                <h2 class="select-genre">All Movies</h2>
              </a>

              <a href="javascript:void(0);"
                onClick={()=>{this.props.selectBy("User Suggestions");this.changeGenreDisplay();this.changeGenreButton();}}>
                <h2 class="select-genre">User Suggestions</h2>
              </a>
            </div>{/* id = genre-link-list */}
          </div>{/* id= genre-link-list-wrapper */}
        </div>{/* id= genre-button-or-list */}

        <div id="sort-by-wrapper">
          <p className='sort-selector'>sort by </p>
          <a
            href="javascript:void(0);"
            style = {{
              color: this.props.sortby==='name' ? 'LawnGreen': 'white'
            }}
            className='sort-selector'
            onClick = {()=>this.props.setSort("name")}>TITLE</a>
          <a
            href="javascript:void(0);"
            style = {{
              color: this.props.sortby==='year' ? 'LawnGreen': 'white'
            }}
            className='sort-selector'
            onClick = {()=>this.props.setSort("year")}>YEAR</a>
        </div>{/* id =sort-by wrapper */}
      </div>//Big main container
    );
  }
}

export default genres;
