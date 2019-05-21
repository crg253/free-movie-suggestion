import React, { Component } from 'react';
import { Link } from "react-router-dom";


class Genres extends Component {
  state={
    displayGenres:'none',
  }

  changeGenreDisplay = () =>{
    if(this.state.displayGenres==="inline"){
      this.setState({displayGenres:"none"})
    }else{
      this.setState({displayGenres:'inline'})
    }
  }



  render() {

    return (
      <div>
        <div id="genre-button-or-list">

          <div id="genre-and-button" style={{display:'flex'}}>
            <h2 className="select-genre" id={this.props.listBy.slice(0,3)}>{this.props.listBy}</h2>
            <button
              className="button-nostyle"
              id='get-genres-button'
              onClick={()=>this.changeGenreDisplay()}>
            </button>
          </div>{/* id= genre-and-button */}


          <div id="genre-link-list-wrapper" style={{display:this.state.displayGenres}}>

              <div id="desk-genre-link-list">
                {this.props.genres.filter(g=>g!==this.props.listBy).map(genre=>(
                  <div
                    key={"desk-genre-link-list"+genre}
                    onClick={()=>{
                      this.props.chooseListBy(genre);
                      this.changeGenreDisplay();}}>
                        <Link to={'/' + this.props.randomMovies[genre].slug}>
                          <h2
                            style = {{
                              color: this.props.listBy===genre ? 'white': '#D4D4D4'
                            }}
                            id={genre.slice(0,3)}
                            className="select-genre">{genre} </h2>
                        </Link>
                  </div>//Javascript Comment
                ))}

                <div style={{display:'block'}}>
                  <button
                    className="button-nostyle"
                    onClick={()=>{this.props.chooseListBy("Saved");
                      this.changeGenreDisplay();}}>
                        <h2
                          style = {{
                            color: this.props.listBy==="Saved" ? 'white': '#D4D4D4'
                          }}
                          className="select-genre">Saved</h2>
                  </button>
                </div>

              <div style={{display:'block'}}>
                <button
                  className="button-nostyle"
                  onClick={()=>{this.props.chooseListBy("All");
                    this.changeGenreDisplay();}}>
                      <h2
                        style = {{
                          color: this.props.listBy==="All" ? 'white': '#D4D4D4'
                        }}
                        className="select-genre">All</h2>
                </button>
              </div>

              <div style={{display:'block'}}>
                <button
                  className="button-nostyle"
                  onClick={()=>{this.props.chooseListBy("User Suggestions");
                    this.changeGenreDisplay();}}>
                      <h2
                        style = {{
                          color: this.props.listBy==='User Suggestions' ? 'white': '#D4D4D4'
                        }}
                        className="select-genre">User Suggestions</h2>
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
