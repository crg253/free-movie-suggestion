import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from 'axios';

import HomePage from "./components/HomePage";
import TrailerPage from "./components/TrailerPage";
import Error from "./components/Error";

class App extends Component {
  state = {
    Movies:[],
    Genres:["Action", "Comedy", "Documentary", "Drama", "Horror", "Mystery & Suspense", "Romance", "Sci-Fi" ],
    SavedMovies:[],
    SelectBy:"All"
   }

  selectBy = (choice) => {
    this.setState({SelectBy:choice});
  }

  chooseGenre = (genre) =>{
    console.log("Genre Selected")
    console.log(genre)
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
      axios.get('http://127.0.0.1:5000/movies')
      .then(response=> {
        this.setState({Movies: response.data})
      })
      this.locStorToState();
  }

  render() {

    console.log("All Movies");
    console.log(this.state.Movies);

    return (
        <BrowserRouter>
          <Switch>
            <Route
              path='/:movieslug'
              render={(props)=> <TrailerPage
                                    {...props}
                                    movies={this.state.Movies}
                                    selectBy={this.selectBy}
                                    saveUnsave={this.saveUnsave}
                                    inSaved={this.inSaved}
                                    locStorToState={this.locStorToState}
                                    unsave={this.unsave}/>}/>
          <Route
            path='/'
            render={(props)=> <HomePage
                                {...props}
                                movies={this.state.Movies}
                                genres={this.state.Genres}
                                chooseGenre={this.chooseGenre}/>}/>
            <Route component = {Error} />
          </Switch>
        </BrowserRouter>
    );
  }
}

export default App;
