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
    Genres:['Action', 'Comedy', 'Documentary', 'Drama', 'Horror', 'Mystery & Suspense', 'Romance', 'Sci-Fi' ],
    ListBy:'All',
    SortBy:'name',
    User:'',
    Redirect:'',
    RedirectBack:''
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
       Action:'',Comedy:'',Documentary:'',Drama:'',Horror:'','Mystery & Suspense':'',Romance:'','Sci-Fi':''
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
              User:res.user, Movies:res.movies,Redirect:<Redirect to="/signin"/>,RedirectBack:''})
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


    console.log('all approved movies are ...')
    console.log(this.state.Movies.filter(movie=>movie.status==='approved'))
    console.log('user is ...')
    console.log(this.state.User)
    console.log('SAVED MOVIES are ...')
    console.log(this.state.Movies.filter(movie=>movie.saved ===true))
    console.log('suggested MOVIES are ...')
    console.log(this.state.Movies.filter(movie=>movie.username === this.state.User))


    return (
      <BrowserRouter>
        <div>
          <Route
            path='/'
            render={(props)=> <Menu
                                {...props}
                                movies={this.state.Movies}
                                chooseListBy={this.chooseListBy}/>}/>
          <Switch>
          <Route
            path='/usermovies'
            render={(props)=><UserMovies
                              {...props}
                              user={this.state.User}
                              movies = {this.state.Movies}/>}/>

            <Route
              path='/recommend'
              render={(props)=><Recommend
                                {...props}
                                setUser={this.setUser}
                                user={this.state.User}/>}/>

            <Route
              path='/signin'
              render = {(props)=><SignIn
                                    {...props}
                                    redirectBack = {this.state.RedirectBack}
                                    setUser={this.setUser}
                                    setMovies={this.setMovies}
                                    setRedirect={this.setRedirect}
                                    setRedirectBack={this.setRedirectBack}/>}/>

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
                                    handleSaveUnsave={this.handleSaveUnsave}/>}/>

            <Route
              path='/'
              render={(props)=> <HomePage
                                  {...props}
                                  chooseListBy={this.chooseListBy}
                                  listBy={this.state.ListBy}
                                  getRandomMovies={this.getRandomMovies}/>}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
