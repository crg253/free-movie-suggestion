import React, { Component } from 'react';
import AppContext from "./AppContext";
import axios from 'axios';

class AppProvider extends Component {
  state = {
    Movies:[],
    Genres:[],
    SelectedGenres:[],
    SelectedMovies:[]
  }

  //Each time you click on the genre, the movies that coorespond to that
  //genre are added to SelectedMovies
  //I will change this
  //1. I will add the SelectedGenres back to state. This will be set to toggle
  //2. I will then iterate through this and call this function
  //3. Make sure there are no duplicates
  //Q: That leaves the issue of how to handle other choices like..
  //"all movies", movies by year range, etc
  selectMoviesByGenre = (genre) =>{
    const newSelections = [...this.state.Movies].filter(movie =>movie.tags.includes(genre));
    newSelections.push.apply(newSelections, [...this.state.SelectedMovies]);
    this.setState({SelectedMovies: newSelections});
  }


  componentDidMount(){
      axios.get('http://127.0.0.1:5000/movies')
      .then(response=> {
        this.setState({Movies: response.data})
      })
      axios.get('http://127.0.0.1:5000/genres')
      .then(response=> {
        this.setState({Genres: response.data})
      })
  }

  render() {
    return (
      <AppContext.Provider value={{...this.state, selectMoviesByGenre: this.selectMoviesByGenre }}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppProvider;
