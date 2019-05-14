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
import UserMovies from './components/UserMovies'

class App extends Component {
  state = {
    Movies:[],
    Genres:['Action', 'Comedy', 'Documentary', 'Drama', 'Horror', 'Mystery & Suspense', 'Romance', 'Sci-Fi' ],
    ListBy:'All',
    SortBy:'name',
    User:'',
    SavedMovies:[],
    SignInRedirect:'',
    SuggestedMovies:[]
   }

  setSuggestedMovies = (newSuggestedMovies) =>{
    this.setState({SuggestedMovies:newSuggestedMovies})
  }

  setSignInRedirect = (redirect) => {
    this.setState({SignInRedirect:redirect})
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


  componentDidMount(){
    axios.get('/api/getallmovies')
    .then(response=> {
      this.setState({Movies: response.data})
    })
    fetch('api/getusermovies',{
      method:'GET',
      headers: {
        'Authorization':"Bearer " +localStorage.getItem('token')
        }
    })
    .then(res=>{
      if(res.status ===200){
        res.json()
          .then(res=>{
                this.setState({User:res.user})
                this.setState({SavedMovies:res.savedMovies})
                this.setState({SuggestedMovies:res.suggestedMovies})
          }
        )
      }
    })
  }

  render() {

    console.log("user from app.js is ".concat(this.state.User))
    console.log(this.state.User.concat(" saved movies are ..."))
    console.log(this.state.SavedMovies)
    console.log(this.state.User.concat(" suggested movies are ..."))
    console.log(this.state.SuggestedMovies)

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
                                user={this.state.User}
                                setSavedMovies={this.setSavedMovies}/>}/>
          <Switch>
          <Route
            path='/usermovies'
            render={(props)=><UserMovies
                              {...props}
                              setUser={this.setUser}
                              user={this.state.User}
                              setSignInRedirect={this.setSignInRedirect}
                              setSuggestedMovies={this.setSuggestedMovies}
                              setSavedMovies={this.setSavedMovies}/>}/>

            <Route
              path='/user'
              render={(props)=><User
                                {...props}
                                setUser={this.setUser}
                                user={this.state.User}
                                setSignInRedirect={this.setSignInRedirect}
                                setSuggestedMovies={this.setSuggestedMovies}
                                setSavedMovies={this.setSavedMovies}/>}/>

            <Route
              path='/signin'
              render = {(props)=><SignIn
                                    {...props}
                                    setUser={this.setUser}
                                    user={this.state.User}
                                    signInRedirect={this.state.SignInRedirect}
                                    setSavedMovies={this.setSavedMovies}/>}/>

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
                                    unSave={this.unSave}
                                    genres={this.state.Genres}
                                    listBy={this.state.ListBy}
                                    sortBy={this.state.SortBy}
                                    setSort={this.setSort}
                                    randomMovies={randomMovies}
                                    setUser={this.setUser}
                                    setSavedMovies={this.setSavedMovies}
                                    setSignInRedirect={this.setSignInRedirect}
                                    setSuggestedMovies={this.setSuggestedMovies}/>}/>

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
