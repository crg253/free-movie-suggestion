import React, { Component } from 'react';
import { Link } from "react-router-dom";


class Genres extends Component {


  render() {

    return (
      <div>

        {/* Main Genre */}
        <h2
          className="selected-genre"
          id={this.props.listBy.slice(0,3)}>{this.props.listBy}</h2>



        {/* Desktop List of Genres*/}
        <div style={{
            marginTop:"10px",
            display:'flex',
            flexWrap:"wrap"}}>

          {this.props.genres.map(genre=>(
            <div
              key={"desk-genre-link-list"+genre}
              onClick={()=>{
                this.props.chooseListBy(genre);
                this.props.setLastMovie(this.props.randomMovies[genre].slug)}}>
                <Link to={'/' + this.props.randomMovies[genre].slug}>
                  <p className="genre-list-item">{genre} </p>
                </Link>
            </div>
          ))}

          <button
            className="button-nostyle"
            onClick={()=>this.props.chooseListBy("Saved")}>
              <p className="genre-list-item">Saved</p>
          </button>

          <button
            className="button-nostyle"
            onClick={()=>this.props.chooseListBy("All")}>
              <p className="genre-list-item">All</p>
          </button>

          <button
            className="button-nostyle"
            onClick={()=>this.props.chooseListBy("User Suggestions")}>
              <p className="genre-list-item">User Suggestions</p>
          </button>

        </div>
        {/* END -- Desktop List of Genres*/}




        {/* sort-by-wrapper  */}
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
        </div>{/* END -- sort-by wrapper */}

      </div>//END -- Big main container
    );
  }
}

export default Genres;
