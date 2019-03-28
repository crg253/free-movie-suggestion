import React, { Component } from 'react';
import AppContext from "./AppContext";
import axios from 'axios';

import GenreList from "./GenreList";
import SavedList from "./SavedList";
import CompleteList from "./CompleteList";


class AppProvider extends Component {
  state = {
    Movies:[],
    Genres:["Action", "Comedy", "Documentary", "Drama", "Horror", "Mystery & Suspense", "Romance", "Sci-Fi" ],
    SavedMovies:[],
    SelectBy:"All"
   }

  selectBy = (choice) => {
    console.log(choice);
    this.setState({SelectBy:choice});
  }

  chooseGenre = (genre) =>{
    this.setState({SelectBy: genre});
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
  }

  unsave = (id) => {
    localStorage.setItem(id, 'unsaved');
    this.locStorToState();
  }

  componentDidMount(){
      console.log("Axios call to get all movies");
      axios.get('/movies')
      .then(response=> {
        this.setState({Movies: response.data})
      })
      this.locStorToState();
  }

  render() {

    let randomMovies = {
        Action:'',Comedy:'',Documentary:'',Drama:'',Horror:'',"Mystery & Suspense":'',Romance:'',"Sci-Fi":''};
    if(this.state.Movies.length>0){
      for(let i in this.state.Genres){
        const genreMovies = [...this.state.Movies].filter(movie =>movie.tags.includes(this.state.Genres[i]));
        const randomMovie = genreMovies[Math.floor(Math.random() * genreMovies.length)];
        randomMovies[this.state.Genres[i]]=randomMovie;
      }
    console.log("New random movie list generated");
    }

    let selectionComponent = null;
    switch(this.state.SelectBy){
      case("All"):
        selectionComponent = <CompleteList/>
        console.log("Complete List selected");
        break;
      case("Saved"):
        selectionComponent = <SavedList/>
        console.log("Saved List selected");
        break;
      default:
        selectionComponent =<GenreList/>
        console.log("Genre List selected");
    }

    return (
      <AppContext.Provider
          value={{...this.state,
                    randomMovies:randomMovies,
                    saveUnsave:this.saveUnsave,
                    inSaved:this.inSaved,
                    locStorToState:this.locStorToState,
                    selectBy:this.selectBy,
                    selectionComponent:selectionComponent,
                    chooseGenre:this.chooseGenre,
                    unsave:this.unsave}}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppProvider;
