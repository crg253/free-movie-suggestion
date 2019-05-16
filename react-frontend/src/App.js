import React, { Component } from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';

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
    User:''
  }

   setMovies = (newMovies) => {
     this.setState({Movies:newMovies})
   }
   chooseListBy = (choice) => {
     this.setState({ListBy:choice});
   }
   setSort = (sortParam) =>{
     this.setState({SortBy:sortParam})
   }
   setUser = (newUser) =>{
     this.setState({User:newUser});
   }

   handleFetch = (route,headers,body) => {
     console.log(route)
     fetch('api/'.concat(route),{
      method:'POST',
      headers:headers,
      body: body
    })
    .then(res=>{
        res.json()
        .then(res=>{
              this.setState({User:res.user})
              this.setState({Movies:res.movies})
              if(res.token !==undefined){
                localStorage.setItem('token', res.token)
            }
          })
        })
      }

  componentDidMount(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    this.handleFetch('checktoken', headers,'')
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

    console.log('movies are ...')
    console.log(this.state.Movies)
    console.log('user is ...')
    console.log(this.state.User)
    console.log('SAVED MOVIES are ...')
    console.log(this.state.Movies.filter(movie=>movie.saved ===true))

    return (
      <BrowserRouter>
        <div>
          <Route
            path='/'
            render={(props)=> <Menu
                                {...props}
                                handleFetch={this.handleFetch}/>}/>
          <Switch>
          <Route
            path='/usermovies'
            render={(props)=><UserMovies
                              {...props}
                              setUser={this.setUser}
                              user={this.state.User}/>}/>

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
                                    handleFetch={this.handleFetch}/>}/>

            <Route
              path='/adduser'
              component= {AddUser}/>

            <Route
              path='/:movieslug'
              render={(props)=> <TrailerPage
                                    {...props}
                                    movies={movies}
                                    userSuggestions={userSuggestions}
                                    chooseListBy={this.chooseListBy}
                                    genres={this.state.Genres}
                                    listBy={this.state.ListBy}
                                    sortBy={this.state.SortBy}
                                    setSort={this.setSort}
                                    randomMovies={randomMovies}
                                    handleSaveUnsave={this.handleSaveUnsave}
                                    handleGetSavedMovies={this.handleGetSavedMovies}
                                    handleFetch={this.handleFetch}/>}/>

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
