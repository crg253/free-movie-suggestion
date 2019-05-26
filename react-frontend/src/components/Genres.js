import React, { Component } from 'react';
import { Link } from "react-router-dom";


class Genres extends Component {
    state={
      MobileGenresDisplay:'none',
    }

    changeMobileGenresDisplay = () =>{
      if(this.state.MobileGenresDisplay==="flex"){
        this.setState({MobileGenresDisplay:"none"})
      }else{
        this.setState({MobileGenresDisplay:'flex'})
      }
    }

  render() {

    return (
      <div>

        <div id="genre-and-button" >
          <h2 className="selected-genre" id={this.props.listBy.slice(0,3)}>{this.props.listBy}</h2>

          <button
            className="button-nostyle"
            id='get-genres-button'
            onClick={()=>{this.changeMobileGenresDisplay();}}>
          </button>
        </div>{/* id= genre-and-button */}


        {/* START --> genre-list */}
        <div style={{
            display:this.state.MobileGenresDisplay,
            flexWrap:'wrap',
            position:'absolute',
            backgroundColor:'#1F1F1F',
            border:'1px solid white',
            margin:'12px 0 0 0',
            padding:'20px',
            width:'38.5vw'}}>
          {this.props.genres.map(genre=>(
            <div
              key={"mobile-genre-link-list"+genre}
              onClick={()=>{
                this.props.chooseListBy(genre);
                this.changeMobileGenresDisplay();}}>
                  <Link to={'/' + this.props.randomMovies[genre].slug}>
                    <h2 className="genre-list-item">{genre} </h2>
                  </Link>
            </div>//Javascript Comment
          ))}

            <div>
              <button
                className="button-nostyle"
                onClick={()=>{this.props.chooseListBy("Saved");
                  this.changeMobileGenresDisplay();}}>
                    <h2 className="genre-list-item">Saved</h2>
              </button>
            </div>

            <div>
              <button
                className="button-nostyle"
                onClick={()=>{this.props.chooseListBy("All");
                  this.changeMobileGenresDisplay();}}>
                    <h2 className="genre-list-item">All</h2>
              </button>
            </div>

            <div>
              <button
                className="button-nostyle"
                onClick={()=>{this.props.chooseListBy("User Suggestions");
                this.changeMobileGenresDisplay();}}>
                    <h2 className="genre-list-item">User Suggestions</h2>
              </button>
            </div>
        </div>{/* END --> genre-list */}


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
