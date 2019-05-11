import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from 'axios';

import './App.css';
import HomePage from "./components/HomePage";
import TrailerPage from "./components/TrailerPage";
import SignIn from "./components/SignIn";
import AddUser from "./components/AddUser";
import User from "./components/User";
import Menu from "./components/Menu";

class App extends Component {
  state = {
    Movies:[],
    Genres:["Action", "Comedy", "Documentary", "Drama", "Horror", "Mystery & Suspense", "Romance", "Sci-Fi" ],
    SavedMovies:[],
    ListBy:"All",
    Param:'',
    SortBy:'name',
    User:''
   }

  setUser = (newUser) =>{
    this.setState({User:newUser});
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

    let saved = Object.keys(localStorage)
                    .filter(slug=>localStorage.getItem(slug)==='saved');

    this.setState({SavedMovies:saved});
  }

  saveUnsave = (movieslug) => {
    if (!localStorage.getItem(movieslug)){
      localStorage.setItem(movieslug, 'saved');
    }else if (localStorage.getItem(movieslug)==='unsaved'){
      localStorage.setItem(movieslug, 'saved');
    }else{
      localStorage.setItem(movieslug, 'unsaved');
    }
    this.locStorToState();
  }

  unsave = (id) => {
    localStorage.setItem(id, 'unsaved');
    this.locStorToState();
  }

  refreshMovies = () => {
    axios.get('/api/movies')
    .then(response=> {
      this.setState({Movies: response.data})
    })
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

    let randomMovies = {
        Action:'',Comedy:'',Documentary:'',Drama:'',Horror:'',"Mystery & Suspense":'',Romance:'',"Sci-Fi":''
    };
    if(movies.length>0){
        for(let i in this.state.Genres){
        const genreMovies = [...movies].filter(movie =>movie.tags.includes(this.state.Genres[i]));
        const randomMovie = genreMovies[Math.floor(Math.random() * genreMovies.length)];
        randomMovies[this.state.Genres[i]]=randomMovie;
        }
    }

    return (
      <BrowserRouter>
        <div>
          <Route
            path='/'
            render={(props)=> <Menu
                                {...props}
                                genres={this.state.Genres}
                                selectBy={this.selectBy}
                                randomMovies={randomMovies}
                                setUser={this.setUser}
                                user={this.state.User}/>}/>
          <Switch>
            <Route
              path='/user'
              render={(props)=><User
                                {...props}
                                setUser={this.setUser}
                                user={this.state.User}/>}/>

            <Route
              path='/signin'
              render = {(props)=><SignIn
                                    {...props}
                                    setUser={this.setUser}
                                    user={this.state.User}/>}/>

            <Route
              path='/adduser'
              component= {AddUser}/>

            <Route
              path='/:movieslug'
              render={(props)=> <TrailerPage
                                    {...props}
                                    refreshMovies={this.refreshMovies}
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
                                    setSort={this.setSort}
                                    randomMovies={randomMovies}/>}/>

            <Route
              path='/'
              render={(props)=> <HomePage
                                  {...props}
                                  movies={movies}
                                  genres={this.state.Genres}
                                  chooseGenre={this.chooseGenre}
                                  listby={this.state.ListBy}
                                  randomMovies={randomMovies}/>}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
