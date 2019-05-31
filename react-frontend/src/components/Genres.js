import React, { Component } from 'react';
import { Link } from "react-router-dom";


class Genres extends Component {

  componentDidMount(){
    let i = this.props.scrollGenres.indexOf(this.props.listBy)
    if (i===0){
      this.props.setIndexes(9,i,1)
    }else{
      this.props.setIndexes(i-1,i,i+1)
    }
  }

  render() {

    let randomMovies = this.props.getRandomMovies()
    let goUpButton=''
    let goDownButton=''
    if(randomMovies['All']!==undefined){
      goDownButton =
        <Link
          to={'/' + randomMovies[this.props.scrollGenres[this.props.indexDown]].slug}
          onClick={()=>{
            this.props.chooseListBy(this.props.scrollGenres[this.props.indexDown]);
            this.props.subtractGenreIndex();
            this.props.setLastMovie(randomMovies[this.props.scrollGenres[this.props.indexDown]].slug);}}>
        <button
          className="button-nostyle"
          id='back-genres-button'>
        </button>
        </Link>
      goUpButton=
        <Link
          to={'/' + randomMovies[this.props.scrollGenres[this.props.indexUp]].slug}
          onClick={()=>{
            this.props.chooseListBy(this.props.scrollGenres[this.props.indexUp]);
            this.props.addGenreIndex();
            this.props.setLastMovie(randomMovies[this.props.scrollGenres[this.props.indexUp]].slug);}}>
        <button
          className="button-nostyle"
          id='forward-genres-button'>
        </button>
        </Link>
    }

    console.log(this.props.indexDown);
    console.log(this.props.genreIndex);
    console.log(this.props.indexUp)


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
