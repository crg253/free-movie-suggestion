import React, { Component } from 'react';
import { Link } from "react-router-dom";


class Genres extends Component {
    state={
      MobileGenresDisplay:'none',
    }

    changeMobileGenresDisplay = () =>{
      if(this.state.MobileGenresDisplay==="inline"){
        this.setState({MobileGenresDisplay:"none"})
      }else{
        this.setState({MobileGenresDisplay:'inline'})
      }
    }

  render() {

    return (
      <div>


        <div id="genre-and-button" >
          <h2 className="selected-genre" id={this.props.listBy.slice(0,3)}>{this.props.listBy}</h2>

          {/* Button for getting mobile list of genres*/}
          <button
            className="button-nostyle"
            id='get-genres-button'
            onClick={()=>{this.changeMobileGenresDisplay();}}>
          </button>
        </div>{/* id= genre-and-button */}


        {/* Desktop List of Genres*/}
        <div id="desktop-genres-list">

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

        {/* START -- mobile-genre-link-list */}
        <div style={{display:this.state.MobileGenresDisplay}}>
          {this.props.genres.map(genre=>(
            <div
              key={"mobile-genre-link-list"+genre}
              onClick={()=>{
                this.props.chooseListBy(genre);
                this.changeMobileGenresDisplay();}}>
                  <Link to={'/' + this.props.randomMovies[genre].slug}>
                    <h2
                      style = {{
                        color: this.props.listBy===genre ? 'white': '#9E9E9E'
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
                  this.changeGenreDisplay();
                  this.changeGenreButton();}}>
                    <h2
                      style = {{
                        color: this.props.listBy==="Saved" ? 'white': '#9E9E9E'
                      }}
                      className="select-genre">Saved</h2>
              </button>
            </div>

            <div style={{display:'block'}}>
              <button
                className="button-nostyle"
                onClick={()=>{this.props.chooseListBy("All");
                  this.changeGenreDisplay();
                  this.changeGenreButton();}}>
                    <h2
                      style = {{
                        color: this.props.listBy==="All" ? 'white': '#9E9E9E'
                      }}
                      className="select-genre">All</h2>
              </button>
            </div>

            <div style={{display:'block'}}>
              <button
                className="button-nostyle"
                onClick={()=>{this.props.chooseListBy("User Suggestions");
                  this.changeGenreDisplay();
                  this.changeGenreButton();}}>
                    <h2
                      style = {{
                        color: this.props.listBy==='User Suggestions' ? 'white': '#9E9E9E'
                      }}
                      className="select-genre">User Suggestions</h2>
              </button>
            </div>
        </div>{/* id = mobile-genre-link-list */}


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
