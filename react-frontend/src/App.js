import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

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
    Redirect:'',
    RedirectBackSlug:'',
    RedirectBack:'',
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
   setRedirect = (redirect) => {
     this.setState({Redirect:redirect})
   }
   setRedirectBack = (redirect) => {
     this.setState({RedirectBack:redirect})
   }
   setRedirectSlug = (redirect) => {
     this.setState({RedirectBack:redirect})
   }

   resetUserAndMovies = () =>{
     fetch('api/getmovies',{
       method:'GET'
     })
     .then(res=>{
       if(res.status===200){
         res.json()
         .then(res=>{
           this.setState({User:res.user})
           this.setState({Movies:res.movies})
         })
       }
     })
   }

   handleSaveUnsave = (action, slug) =>{
     fetch('api/'.concat(action),{
       method:'POST',
       headers:{
         'Authorization':"Bearer " +localStorage.getItem('token'),
         'Content-Type':'application/json'
       },
       body: JSON.stringify({slug: slug})
      })
      .then(res=>{
        if(res.status===401){
          this.resetUserAndMovies()
          this.setState({RedirectBackSlug:slug})
          this.setState({Redirect:<Redirect to='/signin'/>})
        }else if(res.status ===200){
          res.json()
          .then(res=>{
            this.setState({'User':res.user})
            this.setState({'Movies':res.movies})

          })
        }
     })
   }

   handleGetSavedMovies = (slug) =>{
     fetch('api/checktoken',{
       method:'POST',
       headers: {
         'Authorization':"Bearer " +localStorage.getItem('token')
         }
     })
     .then(res=>{
       if(res.status===401){
         this.resetUserAndMovies()
         this.setState({RedirectBackSlug:slug})
         this.setState({Redirect:<Redirect to='/signin'/>})
       }else if(res.status ===200){
         res.json()
         .then(res=>{
           this.setState({'User':res.user})
           this.setState({'Movies':res.movies})
         })
       }
    })
   }

  componentDidMount(){
    fetch('api/checktoken',{
      method:'POST',
      headers: {
        'Authorization':"Bearer " +localStorage.getItem('token')
        }
    })
    .then(res=>{
      if(res.status===200){
        res.json()
        .then(res=>{
              this.setState({User:res.user})
              this.setState({Movies:res.movies})
        })
      }else if (res.status===401) {
        this.resetUserAndMovies()
      }
    })
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

    console.log('saved movie list ...')
    console.log(this.state.Movies.filter(movie=>movie.saved ===true))
    console.log('SUGGESTED movie list ...')
    console.log(this.state.Movies.filter(movie=>movie.username===this.state.User))

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
            path='/usermovies'
            render={(props)=><UserMovies
                              {...props}
                              setUser={this.setUser}
                              user={this.state.User}
                              setSignInRedirect={this.setSignInRedirect}
                              setSuggestedMovies={this.setSuggestedMovies}/>}/>

            <Route
              path='/user'
              render={(props)=><User
                                {...props}
                                setUser={this.setUser}
                                user={this.state.User}
                                setSignInRedirect={this.setSignInRedirect}
                                setSuggestedMovies={this.setSuggestedMovies}/>}/>

            <Route
              path='/signin'
              render = {(props)=><SignIn
                                    {...props}
                                    setUser={this.setUser}
                                    user={this.state.User}
                                    setMovies={this.setMovies}
                                    setRedirect={this.setRedirect}
                                    redirectBackSlug={this.state.RedirectBackSlug}
                                    setRedirectBack={this.setRedirectBack}
                                    redirectBack={this.state.RedirectBack}/>}/>

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
                                    redirect={this.state.Redirect}
                                    handleGetSavedMovies={this.handleGetSavedMovies}/>}/>

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
