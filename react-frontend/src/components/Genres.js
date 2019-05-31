import React, { Component } from 'react';
import { Link } from "react-router-dom";


class Genres extends Component {
  state={
    GenreIndex:'0',
    IndexUp:'0',
    IndexDown:'0'
  }
  subtractGenreIndex=()=>{
    if(this.state.GenreIndex===0){
      this.setState({
        IndexUp:this.state.GenreIndex,
        GenreIndex:9,
        IndexDown:this.state.IndexDown-1})
    }
    else if(this.state.GenreIndex===1){
      this.setState({
        IndexUp:this.state.GenreIndex,
        GenreIndex:this.state.GenreIndex-1,
        IndexDown:9})
    }else{
      this.setState({
        IndexUp:this.state.GenreIndex,
        GenreIndex:this.state.GenreIndex-1,
        IndexDown:this.state.IndexDown-1})
    }
  }
  addGenreIndex=()=>{
    if(this.state.GenreIndex===9){
      this.setState({
        IndexDown:this.state.GenreIndex,
        GenreIndex:0,
        IndexUp:this.state.IndexUp+1})
    }
    else if (this.state.GenreIndex===8){
      this.setState({
        IndexDown:this.state.GenreIndex,
        GenreIndex:this.state.GenreIndex+1,
        IndexUp:0})
    }else{
      this.setState({
        IndexDown:this.state.GenreIndex,
        GenreIndex:this.state.GenreIndex+1,
        IndexUp:this.state.IndexUp+1})
    }
  }

  componentDidMount(){
    let i = this.props.scrollGenres.indexOf(this.props.listBy)
    if (i===0){
      this.setState({
        GenreIndex:i,
        IndexUp:1,
        IndexDown:9})
    }else{
      this.setState({
        GenreIndex:i,
        IndexUp:i+1,
        IndexDown:i-1})
    }
  }

  render() {

    console.log(this.state.IndexDown)
    console.log(this.state.GenreIndex)
    console.log(this.state.IndexUp)

    let randomMovies = this.props.getRandomMovies()
    let goUpButton=''
    let goDownButton=''
    if(randomMovies['All']!==undefined){
      goDownButton =
        <Link
          to={'/' + randomMovies[this.props.scrollGenres[this.state.IndexDown]].slug}
          onClick={()=>{
            this.props.chooseListBy(this.props.scrollGenres[this.state.IndexDown]);
            this.subtractGenreIndex();}}>
        <button
          className="button-nostyle"
          id='back-genres-button'>
        </button>
        </Link>
      goUpButton=
        <Link
          to={'/' + randomMovies[this.props.scrollGenres[this.state.IndexUp]].slug}
          onClick={()=>{
            this.props.chooseListBy(this.props.scrollGenres[this.state.IndexUp]);
            this.addGenreIndex();}}>
        <button
          className="button-nostyle"
          id='forward-genres-button'>
        </button>
        </Link>

    }



    return (
      <div id="main-genres-wrapper">

        <div
          id="genre-and-button" >
          <h2
            className="selected-genre"
            id={this.props.listBy.slice(0,3)}>{this.props.listBy}</h2>
            {goDownButton}
            {goUpButton}
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
