import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from 'axios';

import './App.css';
import HomePage from "./components/HomePage";
import TrailerPage from "./components/TrailerPage";
import Error from "./components/Error";
import SignIn from "./components/SignIn";
import AddUser from "./components/AddUser";
import User from "./components/User";

class App extends Component {
  state = {
    Movies:[],
    Genres:["Action", "Comedy", "Documentary", "Drama", "Horror", "Mystery & Suspense", "Romance", "Sci-Fi" ],
    SavedMovies:[],
    ListBy:"All",
    Param:'',
    SortBy:'name'
   }

  setSort = (sortParam) =>{
    this.setState({SortBy:sortParam})
  }

  setParam = (newParam) =>{
    this.setState({Param:newParam})
  }
  selectBy = (choice) => {
    this.setState({ListBy:choice});
  }

  chooseGenre = (genre) =>{
    this.setState({ListBy: genre});
  }

  inListBy = (genre) =>{
    return this.state.ListBy.includes(genre)
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
    axios.get('/api/movies')
    .then(response=> {
      this.setState({Movies: response.data})
    })
    this.locStorToState();
  }

  render() {
    let movies = this.state.Movies.filter(movie=>movie.status==="approved");
    let userMovies = this.state.Movies.filter(movie=>movie.status==="pending");
    console.log(this.state.ListBy)
    console.log(userMovies)
    return (
      <BrowserRouter>
        <Switch>
          <Route
            path='/user'
            component = {User}/>

          <Route
            path='/signin'
            component = {SignIn}/>

          <Route
            path='/adduser'
            component= {AddUser}/>

          <Route
            path='/:movieslug'
            render={(props)=> <TrailerPage
                                  {...props}
                                  movies={movies}
                                  userMovies={userMovies}
                                  savedmovies={this.state.SavedMovies}
                                  selectBy={this.selectBy}
                                  saveUnsave={this.saveUnsave}
                                  inSaved={this.inSaved}
                                  locStorToState={this.locStorToState}
                                  unsave={this.unsave}
                                  genres={this.state.Genres}
                                  listby={this.state.ListBy}
                                  inlistby={this.inListBy}
                                  param={this.state.Param}
                                  setparam={this.setParam}
                                  sortby={this.state.SortBy}
                                  setSort={this.setSort}/>}/>

          <Route
            path='/'
            render={(props)=> <HomePage
                                {...props}
                                movies={movies}
                                genres={this.state.Genres}
                                chooseGenre={this.chooseGenre}
                                listby={this.state.ListBy}/>}/>
          <Route component = {Error} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
