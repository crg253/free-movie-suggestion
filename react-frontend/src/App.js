import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from 'axios';

import HomePage from "./components/HomePage";
import TrailerPage from "./components/TrailerPage";
import ListPage from "./components/ListPage";
import Error from "./components/Error";

class App extends Component {
  state = {
    Movies:[],
    Genres:["Action", "Comedy", "Documentary", "Drama", "Horror", "Mystery & Suspense", "Romance", "Sci-Fi" ],
    SavedMovies:[],
    ListBy:"All"
   }


  selectBy = (choice) => {
    this.setState({ListBy:choice});
  }

  chooseGenre = (genre) =>{
    this.setState({ListBy: genre});
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
      axios.get('http://127.0.0.1:5000/movies')
      .then(response=> {
        this.setState({Movies: response.data})
      })
      this.locStorToState();
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route
            path='/list'
            render={(props)=> <ListPage
                                  {...props}
                                  movies={this.state.Movies}
                                  savedmovies={this.state.SavedMovies}
                                  unsave={this.unsave}
                                  genres={this.state.Genres}
                                  listby={this.state.ListBy}
                                  selectBy={this.selectBy}/>}/>

          <Route
            path='/:movieslug'
            render={(props)=> <TrailerPage
                                  {...props}
                                  movies={this.state.Movies}
                                  savedmovies={this.state.SavedMovies}
                                  selectBy={this.selectBy}
                                  saveUnsave={this.saveUnsave}
                                  inSaved={this.inSaved}
                                  locStorToState={this.locStorToState}
                                  unsave={this.unsave}
                                  genres={this.state.Genres}
                                  listby={this.state.ListBy}/>}/>

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
