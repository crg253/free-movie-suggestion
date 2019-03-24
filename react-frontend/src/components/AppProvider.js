import React, { Component } from 'react';
import AppContext from "./AppContext";
import axios from 'axios';

class AppProvider extends Component {
  state = {
    Movies:[],
    Genres:["Action", "Comedy", "Documentary", "Drama", "Horror", "Mystery & Suspense", "Romance", "Sci-Fi" ],
    chosenMovie:{},
    SelectedMovies:[]
  }

  chooseGenre = (genre) =>{
    const newSelections = [...this.state.Movies].filter(movie =>movie.tags.includes(genre));
    this.setState({SelectedMovies: newSelections});
  }

  componentDidMount(){
      console.log("componentDidMount");
      axios.get('http://127.0.0.1:5000/movies')
      .then(response=> {
        this.setState({Movies: response.data})
      })
  }

  render() {
    //Create the random movies list here
    let randomMovies = {
        Action:'',Comedy:'',Documentary:'',Drama:'',Horror:'',"Mystery & Suspense":'',Romance:'',"Sci-Fi":''};
    if(this.state.Movies.length>0){
      console.log("Create randomMovies");
      for(let i in this.state.Genres){
        const genreMovies = [...this.state.Movies].filter(movie =>movie.tags.includes(this.state.Genres[i]));
        const randomMovie = genreMovies[Math.floor(Math.random() * genreMovies.length)];
        randomMovies[this.state.Genres[i]]=randomMovie;
      }
    }

    console.log(this.state.Movies);
    console.log(randomMovies);


    return (
      <AppContext.Provider
          value={{...this.state, chooseGenre: this.chooseGenre, randomMovies:randomMovies}}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppProvider;
