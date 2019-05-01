import React, { Component } from 'react';


class genres extends Component {
  state={
    displayGenres:'none'
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

        <div id="listed-by">
          <h1 >{this.props.listby}</h1>
          <button
            onClick={()=>this.changeGenreDisplay()}
            style={{width:"10px", height:'10px', color:"white"}}></button>
        </div>

          <div
            id="genre-link-list"
            style={{
              position:'absolute',
              display:this.state.displayGenres,
              color:'black',
              backgroundColor:"white"}}>
            {this.props.genres.map(genre=>(
                <a
                  href="javascript:void(0);"
                  onClick={()=>{this.props.selectBy(genre);this.changeGenreDisplay();}}
                  style={{
                    color:'black',
                    display:"block"}}>{genre+" "} </a>
            ))}
            <a
              href="javascript:void(0);"
              onClick={()=>{this.props.selectBy("Saved");this.changeGenreDisplay();}}
              style={{
                color:'black',
                display:"block"}}>Saved</a>
            <a href="javascript:void(0);"
              onClick={()=>{this.props.selectBy("All");this.changeGenreDisplay();}}
              style={{
                color:'black',
                display:"block"}}>All Movies</a>
            <a href="javascript:void(0);"
              onClick={()=>{this.props.selectBy("User Suggestions");this.changeGenreDisplay();}}
              style={{
                color:'black',
                display:"block"}}>USER SUGGESTIONS</a>
            </div>

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
        </div>
      </div>

    );
  }
}

export default genres;
