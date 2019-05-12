import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import './App.css';
import HomePage from './components/HomePage';
import TrailerPage from './components/TrailerPage';
import SignIn from './components/SignIn';
import AddUser from './components/AddUser';
import User from './components/User';
import Menu from './components/Menu';

class App extends Component {
  state = {
    Movies:[],
    Genres:['Action', 'Comedy', 'Documentary', 'Drama', 'Horror', 'Mystery & Suspense', 'Romance', 'Sci-Fi' ],
    ListBy:'All',
    SortBy:'name',
    User:'',
    SavedMovies:[]
   }

  setSavedMovies = (newSavedMovies) =>{
    this.setState({SavedMovies:newSavedMovies})
  }

  setUser = (newUser) =>{
    this.setState({User:newUser});
  }

  setSort = (sortParam) =>{
    this.setState({SortBy:sortParam})
  }

  chooseListBy = (choice) => {
    this.setState({ListBy:choice});
  }

  locStorToState = () => {
    let saved = Object.keys(localStorage)
                    .filter(slug=>localStorage.getItem(slug)==='saved');

    this.setState({SavedMovies:saved});
  }

  // saveUnsave = (movieslug) => {
  //   if (!localStorage.getItem(movieslug)){
  //     localStorage.setItem(movieslug, 'saved');
  //   }else if (localStorage.getItem(movieslug)==='unsaved'){
  //     localStorage.setItem(movieslug, 'saved');
  //   }else{
  //     localStorage.setItem(movieslug, 'unsaved');
  //   }
  //   this.locStorToState();
  // }

  // unSave = (id) => {
  //   localStorage.setItem(id, 'unsaved');
  //   this.locStorToState();
  // }

  componentDidMount(){
    axios.get('/api/movies')
    .then(response=> {
      this.setState({Movies: response.data})
    })
    //this.locStorToState();
  }

  render() {

    let movies = this.state.Movies.filter(movie=>movie.status==='approved');
    let userSuggestions = this.state.Movies.filter(movie=>movie.status==='pending');

    let randomMovies = {
        Action:'',Comedy:'',Documentary:'',Drama:'',Horror:'','Mystery & Suspense':'',Romance:'','Sci-Fi':''
    };
    if(movies.length>0){
        for(let i in this.state.Genres){
        const genreMovies = [...movies].filter(movie =>movie.tags.includes(this.state.Genres[i]));
        const randomMovie = genreMovies[Math.floor(Math.random()*genreMovies.length)];
        randomMovies[this.state.Genres[i]] = randomMovie;
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
                                chooseListBy={this.chooseListBy}
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
                                    movies={movies}
                                    userSuggestions={userSuggestions}
                                    savedMovies={this.state.SavedMovies}
                                    chooseListBy={this.chooseListBy}
                                    saveUnsave={this.saveUnsave}
                                    locStorToState={this.locStorToState}
                                    unSave={this.unSave}
                                    genres={this.state.Genres}
                                    listBy={this.state.ListBy}
                                    sortBy={this.state.SortBy}
                                    setSort={this.setSort}
                                    randomMovies={randomMovies}
                                    setUser={this.setUser}
                                    setSavedMovies={this.setSavedMovies}/>}/>

            <Route
              path='/'
              render={(props)=> <HomePage
                                  {...props}
                                  chooseListBy={this.chooseListBy}
                                  listBy={this.state.ListBy}
                                  randomMovies={randomMovies}/>}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
