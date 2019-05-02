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

          <div
            id="genre-and-button"
            style={{
            display:this.state.displayGenreButton}}>
            <h2 >{this.props.listby}</h2>
            <a href="javascript:void(0);">
              <div
                onClick={()=>{this.changeGenreDisplay();this.changeGenreButton();}}
                style={{
                  marginLeft:"10px",
                  width:"20px",
                  height:"20px",
                  backgroundColor:"blue"}}>
              </div>{/* Button*/}
            </a>{/* Button */}
          </div>{/* id= genre-and-button */}

          <div
            id="genre-link-list"
            style={{
              display:this.state.displayGenres,
              }}>
              {this.props.genres.map(genre=>(
                <div onClick={()=>{this.props.selectBy(genre);this.changeGenreDisplay();this.changeGenreButton();}}>
                <Link to={'/' + this.props.randomMovies[genre].slug}><h2>{genre}</h2></Link>
                </div>//Javascript Comment
              ))}
            <a
              href="javascript:void(0);"
              onClick={()=>{this.props.selectBy("Saved");this.changeGenreDisplay();this.changeGenreButton();}}
              style={{
                display:"block"}}><h2>Saved</h2></a>
            <a href="javascript:void(0);"
              onClick={()=>{this.props.selectBy("All");this.changeGenreDisplay();this.changeGenreButton();}}
              style={{
                display:"block"}}><h2>All Movies</h2></a>
            <a href="javascript:void(0);"
              onClick={()=>{this.props.selectBy("User Suggestions");this.changeGenreDisplay();this.changeGenreButton();}}
              style={{
                display:"block"}}><h2>USER SUGGESTIONS</h2></a>
          </div>{/* id = genre-link-list */}

        </div>{/* id= genre-button-or-list */}


        <div id="sort-by-wrapper">
          <p className='sort-selector'>sort by </p>
          <p
            style = {{
              color: this.props.sortby==='name' ? 'LawnGreen': 'white'
            }}
            className='sort-selector'
            onClick = {()=>this.props.setSort("name")}>TITLE</p>
          <p
            style = {{
              color: this.props.sortby==='year' ? 'LawnGreen': 'white'
            }}
            className='sort-selector'
            onClick = {()=>this.props.setSort("year")}>YEAR</p>
        </div>{/* id =sort-by wrapper */}

      </div>//Big main container
    );
  }
}

export default genres;
