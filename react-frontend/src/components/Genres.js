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


        <div
          id="listed-by"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:"center"
          }}>

          <h1 >{this.props.listby}</h1>

          <a href="javascript:void(0);"><div
            onClick={()=>this.changeGenreDisplay()}
            style={{
              marginLeft:"10px",
              width:"20px",
              height:"20px",
              backgroundColor:"blue"}}>
          </div></a>

            <div
              id="genre-link-list"
              style={{
                position:'absolute',
                margin:"290px 0 0 0",
                width:"75%",
                display:this.state.displayGenres,
                color:'black',
                backgroundColor:"white"
                }}>
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
