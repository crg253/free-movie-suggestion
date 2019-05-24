import React, { Component } from 'react';
import { Link } from "react-router-dom";


class Genres extends Component {
  state={
    GenreListDisplay:'none'
  }

  changeGenreListDisplay = () =>{
    if(this.state.GenreListDisplay==='none'){
      this.setState({GenreListDisplay:'flex'})
    }else{
      this.setState({GenreListDisplay:'none'})
    }
  }

  render() {

    return (
      <div>

        <div id="genre-and-button" style={{display:'flex'}}>
          <h2 className="selected-genre">{this.props.listBy}</h2>
          <button
            id="get-genres-button"
            class="button-nostyle"
            onClick = {()=>this.changeGenreListDisplay()}></button>
        </div>{/* id= genre-and-button */}

        <div style={{
            marginTop:"10px",
            flexWrap:"wrap",
            display:this.state.GenreListDisplay}}>

          {this.props.genres.map(genre=>(
              <h3 className="genre-list-item">{genre}</h3>
          ))}
          <h3 className="genre-list-item">Saved</h3>
          <h3 className="genre-list-item">ALL</h3>
          <h3 className="genre-list-item">User Suggestions</h3>
      </div>

      </div>//Big main container
    );
  }
}

export default Genres;
