import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

import './App.css';
import HomePage from './components/HomePage';
import TrailerPage from './components/TrailerPage';
import SignIn from './components/SignIn';
import AddUser from './components/AddUser';
import Recommend from './components/Recommend';
import Menu from './components/Menu';
import UserMovies from './components/UserMovies'

class App extends Component {

  state = {
    Movies:[],
    Genres:['Action', 'Comedy', 'Documentary', 'Drama', 'Horror', 'Mystery & Suspense', 'Romance', 'Sci-Fi & Fantasy' ],
    ListBy:'All',
    SortBy:'name',
    LastMovie:'comingsoon',
    User:'',
    Redirect:'',
    RedirectBackSlug:'',
    RedirectBack:''
  }


  setLastMovie = (slug)=>{
    this.setState({LastMovie:slug})
  }
  setRedirectBackSlug = (newSlug)=>{
    this.setState({RedirectBackSlug:newSlug})
  }
  setRedirectBack = (newRedirectBack)=>{
    this.setState({RedirectBack:newRedirectBack})
  }
  setRedirect = (newRedirect) =>{
    this.setState({Redirect:newRedirect})
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

  getRandomMovies=()=>{
   let approvedMovies = this.state.Movies.filter(movie=>movie.status==='approved');
   let randomMovies = {
       Action:'',Comedy:'',Documentary:'',Drama:'',Horror:'','Mystery & Suspense':'',Romance:'','Sci-Fi & Fantasy':''
   };
   if(approvedMovies.length>0){
       for(let i in this.state.Genres){
       const genreMovies = [...approvedMovies].filter(approvedMovie =>approvedMovie.tags.includes(this.state.Genres[i]));
       const randomMovie = genreMovies[Math.floor(Math.random()*genreMovies.length)];
       randomMovies[this.state.Genres[i]] = randomMovie;
       }
   }
   return randomMovies
  }

  handleSaveUnsave = (saveunsave, slug) =>{
    fetch('api/'.concat(saveunsave),{
      method:'POST',
      headers:{
         'Authorization':"Bearer " +localStorage.getItem('token'),
         'Content-Type':'application/json'
       },
      body: JSON.stringify({slug: slug})
    })
    .then(res=>{
      if (res.status===401) {
        res.json()
         .then(res=>{
           this.setState({
              User:res.user,
              Movies:res.movies,
              RedirectBackSlug:slug,
              RedirectBack:'',
              Redirect:<Redirect to="/signin"/>})
          })
      }else if (res.status===200){
        res.json()
        .then(res=>{
          this.setState({
             User:res.user, Movies:res.movies})
         })
      }
    })
  }

   handleInitialFetch = () => {
     fetch('api/checktoken',{
      method:'POST',
      headers: {
        'Authorization':"Bearer " +localStorage.getItem('token')
      },
      body:''
    })
    .then(res=>{
      res.json()
       .then(res=>{
          this.setState({User:res.user, Movies:res.movies})
        })
    })
  }

  componentDidMount(){
    this.handleInitialFetch()
  }


  render() {

    // console.log('last movie is ...')
    // console.log(this.state.LastMovie)
    // console.log('user is ...')
    // console.log(this.state.User)
    // console.log('SAVED MOVIES are ...')
    // console.log(this.state.Movies.filter(movie=>movie.saved ===true))
    // console.log('suggested MOVIES are ...')
    // console.log(this.state.Movies.filter(movie=>movie.username === this.state.User))



    return (
      <BrowserRouter>
        <div>
          <Route
            path='/'
            render={(props)=> <Menu
                                {...props}
                                user={this.state.User}
                                movies={this.state.Movies}
                                chooseListBy={this.chooseListBy}
                                setUser={this.setUser}
                                setMovies={this.setMovies}
                                lastMovie = {this.state.LastMovie}
                                genres={this.state.Genres}
                                getRandomMovies={this.getRandomMovies}/>}/>
          <Switch>
          <Route
            path='/usermovies'
            render={(props)=><UserMovies
                              {...props}
                              user={this.state.User}
                              movies = {this.state.Movies}
                              handleSaveUnsave={this.handleSaveUnsave}
                              setUser={this.setUser}
                              setMovies={this.setMovies}
                              setRedirect={this.setRedirect}
                              redirect={this.state.Redirect}
                              setLastMovie={this.setLastMovie}
                              setRedirectBack={this.setRedirectBack}
                              setRedirectBackSlug={this.setRedirectBackSlug}/>}/>

            <Route
              path='/recommend'
              render={(props)=><Recommend
                                {...props}
                                user={this.state.User}
                                setUser={this.setUser}
                                setMovies={this.setMovies}
                                setRedirect={this.setRedirect}
                                redirect={this.state.Redirect}
                                setRedirectBack={this.setRedirectBack}
                                setRedirectBackSlug={this.setRedirectBackSlug}/>}/>

            <Route
              path='/signin'
              render = {(props)=><SignIn
                                    {...props}
                                    redirectBack = {this.state.RedirectBack}
                                    setUser={this.setUser}
                                    setMovies={this.setMovies}
                                    setRedirect={this.setRedirect}
                                    setRedirectBack={this.setRedirectBack}
                                    redirectBackSlug={this.state.RedirectBackSlug}
                                    setRedirectBackSlug={this.setRedirectBackSlug}/>}/>

            <Route
              path='/adduser'
              render = {(props)=><AddUser
                                    {...props}/>}/>

            <Route
              path='/:movieslug'
              render={(props)=> <TrailerPage
                                    {...props}
                                    movies = {this.state.Movies}
                                    chooseListBy={this.chooseListBy}
                                    genres={this.state.Genres}
                                    listBy={this.state.ListBy}
                                    sortBy={this.state.SortBy}
                                    setSort={this.setSort}
                                    getRandomMovies={this.getRandomMovies}
                                    redirect = {this.state.Redirect}
                                    handleSaveUnsave={this.handleSaveUnsave}
                                    setRedirectBack={this.setRedirectBack}
                                    setLastMovie={this.setLastMovie}/>}/>

            <Route
              path='/'
              render={(props)=> <HomePage
                                  {...props}
                                  chooseListBy={this.chooseListBy}
                                  listBy={this.state.ListBy}
                                  getRandomMovies={this.getRandomMovies}
                                  setLastMovie={this.setLastMovie}/>}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
