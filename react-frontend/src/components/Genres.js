import React, { Component } from 'react';
import { Link } from "react-router-dom";


class Genres extends Component {
  state={
    GenreIndex:''
  }
  addGenreIndex=()=>{
    if(this.state.GenreIndex===6){
      this.setState({GenreIndex:-1})
    }else{
      this.setState({GenreIndex:this.state.GenreIndex+1})
    }
  }

  componentDidMount(){
    let i = this.props.genres.indexOf(this.props.listBy)
    this.setState({GenreIndex:i})
  }

  render() {

    //Set up list of genres so you can scroll with arrows
    let scrollGenres = ["All"]
    scrollGenres.push.apply(scrollGenres, [...this.props.genres])
    if(this.props.user.length >0){
      scrollGenres.push("Saved")
    }

    //
    let scrollRandomMovies = this.props.getRandomMovies()
    //console.log(randomMovies)

    return (
      <div id="main-genres-wrapper">

        <div
          id="genre-and-button" >
          <h2
            className="selected-genre"
            id={this.props.listBy.slice(0,3)}>{this.props.listBy}</h2>

          <button
            className="button-nostyle"
            id='back-genres-button'>
          </button>

          {/*
          <Link
            to={'/' + scrollRandomMovies[scrollGenres[this.state.GenreIndex+1]].slug}
            onClick={()=>{
              this.props.chooseListBy(scrollGenres[this.state.GenreIndex+1]);
              this.addGenreIndex();}}>
          <button
            className="button-nostyle"
            id='forward-genres-button'>
          </button>
          </Link>
*/}
        </div>{/* id= genre-and-button */}

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
