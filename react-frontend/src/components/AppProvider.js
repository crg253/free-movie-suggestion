import React, { Component } from 'react';
import AppContext from "./AppContext";
import axios from 'axios';

class AppProvider extends Component {
  state = {
    Movies:[],
    Genres:["Action", "Comedy", "Documentary", "Drama", "Horror", "Mystery & Suspense", "Romance", "Sci-Fi" ],
    SelectedMovies:[],
    SavedMovies:[]
  }

  chooseAll = () => {
    this.setState({SelectedMovies: this.state.Movies})
  }

  chooseGenre = (genre) =>{
    const newSelections = [...this.state.Movies].filter(movie =>movie.tags.includes(genre));
    this.setState({SelectedMovies: newSelections});
  }

  chooseSaved = () => {
    const newSelections = [...this.state.Movies].filter(movie =>this.state.SavedMovies.includes(movie.id));
    this.setState({SelectedMovies: newSelections});
  }

  inSaved = (id) => {
    return this.state.SavedMovies.includes(id)
  }

  locStorToState = () => {
    let saved = Object.keys(localStorage).map(n =>Number(n))
      .filter(n =>localStorage.getItem(n)==="saved");

    this.setState({SavedMovies:saved});
    }


  saveUnsave = (id) => {
    if (!localStorage.getItem(id)){
      localStorage.setItem(id, 'saved');
    }else if (localStorage.getItem(id)==='unsaved'){
      localStorage.setItem(id, 'saved');
    }else{
      localStorage.setItem(id, 'unsaved');
    }
    this.locStorToState();
    this.chooseSaved();
  }

  componentDidMount(){
      axios.get('http://127.0.0.1:5000/movies')
      .then(response=> {
        this.setState({Movies: response.data})
        this.setState({SelectedMovies: response.data})
      })
      this.locStorToState();
  }

  render() {
    //Create the random movies list here
    let randomMovies = {
        Action:'',Comedy:'',Documentary:'',Drama:'',Horror:'',"Mystery & Suspense":'',Romance:'',"Sci-Fi":''};
    if(this.state.Movies.length>0){
      for(let i in this.state.Genres){
        const genreMovies = [...this.state.Movies].filter(movie =>movie.tags.includes(this.state.Genres[i]));
        const randomMovie = genreMovies[Math.floor(Math.random() * genreMovies.length)];
        randomMovies[this.state.Genres[i]]=randomMovie;
      }
    }

    console.log("All Movies");
    console.log(this.state.Movies);
    console.log("All Genres");
    console.log(this.state.Genres);
    console.log("Random Movies");
    console.log(randomMovies);
    console.log("Selected Movies");
    console.log(this.state.SelectedMovies);
    console.log("Saved Movies");
    console.log(this.state.SavedMovies);

    return (
      <AppContext.Provider
          value={{...this.state,
                    chooseGenre: this.chooseGenre,
                    randomMovies:randomMovies,
                    saveUnsave:this.saveUnsave,
                    inSaved:this.inSaved,
                    locStorToState:this.locStorToState,
                    chooseSaved:this.chooseSaved,
                    chooseAll:this.chooseAll}}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppProvider;
