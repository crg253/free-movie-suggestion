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
    ListBy:"All",
    Display:[
      {genre:"Mystery & Suspense",opacity:1, signDisplay:null},
      {genre:"Sci-Fi",opacity:1, signDisplay:null},
      {genre:"Horror",opacity:1, signDisplay:null},
      {genre:"Action",opacity:1, signDisplay:null},
      {genre:"Drama",opacity:1, signDisplay:null},
      {genre:"Documentary",opacity:1, signDisplay:null},
      {genre:"Comedy",opacity:1, signDisplay:null},
      {genre:"Romance",opacity:1, signDisplay:null}
    ]
   }

  highlight = (genreName) => {
    // go through and for each one where genre does not match, then change others
    let newValues = []
    this.state.Display.forEach(element=>{
      if(element.genre === genreName){
        newValues.push({genre:genreName,opacity:1, signDisplay:"inline"})
      }else{
        newValues.push({genre:element.genre,opacity:0.7, signDisplay:"none"})
      }})
    this.setState({Display: newValues});
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
                                display={this.state.Display}
                                movies={this.state.Movies}
                                genres={this.state.Genres}
                                chooseGenre={this.chooseGenre}
                                highlight={this.highlight}/>}/>
          <Route component = {Error} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
