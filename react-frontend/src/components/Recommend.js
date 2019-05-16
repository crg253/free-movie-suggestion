import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import './User.css';

class Recommend extends Component {

  //UserMovies should be in global state
  state={
    SearchValue:'',
    SearchResultOptions:[],
    MovieMessage:'',
  }

  handleSearchValueChange = (event) =>{
    this.setState({SearchValue:event.target.value, SearchResultOptions:[]});
  }

  handleSearchSubmit = (event) =>{
    this.setState({MovieMessage:''})
    event.preventDefault();
    fetch('http://www.omdbapi.com/?s='+this.state.SearchValue+'&apikey=e0bc91cd')
    .then(res=>res.json())
    .then(res=>{
        if(res.Search !== undefined){
          this.setState({SearchResultOptions:res.Search})
        }});
  }


  render() {
    return (
      <div className='user-pages-body-wrapper'>
        <Link to={'/'}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>

        <h1>Hi {this.props.user} !</h1>
        <form onSubmit={this.handleSearchSubmit}>
          <label>
            Search the OMDb to find a movie to suggest.
            <input
                  style={{
                    marginTop:"20px"
                  }}
                  type="text"
                  value={this.state.SearchValue}
                  onChange={this.handleSearchValueChange}/>
          </label>
          <input
                style={{
                  marginTop:"20px"
                }}
                type="submit"
                value="Search"/>
        </form>

        <p>{this.state.MovieMessage}</p>

        {this.state.SearchResultOptions.map(mov=>(
          <div key={"searchresult" + mov.Title+mov.Year}>
          <p>{mov.Title} {mov.Year}</p>
          <button onClick={()=>this.handleSuggestMovie(mov.Title, mov.Year)}>Add</button>
          </div>
        ))}

      </div>
    );
  }
}

export default Recommend;
