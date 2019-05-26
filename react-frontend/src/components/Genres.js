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
      <div id="main-genres-wrapper">

        <h2 className="selected-genre" id={this.props.listBy.slice(0,3)}>{this.props.listBy}</h2>


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
