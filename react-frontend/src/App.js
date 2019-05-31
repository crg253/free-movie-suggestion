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
    ScrollGenres:['All','Action', 'Comedy', 'Documentary', 'Drama', 'Horror', 'Mystery & Suspense', 'Romance', 'Sci-Fi & Fantasy','Saved'],
    ListBy:'All',
    SortBy:'name',
    LastMovie:'comingsoon',
    User:'',
    Redirect:'',
    RedirectBackSlug:'',
    RedirectBack:'',
    GenreIndex:'0',
    IndexUp:'0',
    IndexDown:'0'
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
  setIndexes = (down,index,up)=>{
    this.setState({IndexDown:down,GenreIndex:index,IndexUp:up,})
  }

  subtractGenreIndex=()=>{
    if(this.state.GenreIndex===0){
      this.setState({
        IndexUp:this.state.GenreIndex,
        GenreIndex:9,
        IndexDown:this.state.IndexDown-1})
    }
    else if(this.state.GenreIndex===1){
      this.setState({
        IndexUp:this.state.GenreIndex,
        GenreIndex:this.state.GenreIndex-1,
        IndexDown:9})
    }else{
      this.setState({
        IndexUp:this.state.GenreIndex,
        GenreIndex:this.state.GenreIndex-1,
        IndexDown:this.state.IndexDown-1})
    }
  }

  addGenreIndex=()=>{
    if(this.state.GenreIndex===9){
      this.setState({
        IndexDown:this.state.GenreIndex,
        GenreIndex:0,
        IndexUp:this.state.IndexUp+1})
    }
    else if (this.state.GenreIndex===8){
      this.setState({
        IndexDown:this.state.GenreIndex,
        GenreIndex:this.state.GenreIndex+1,
        IndexUp:0})
    }else{
      this.setState({
        IndexDown:this.state.GenreIndex,
        GenreIndex:this.state.GenreIndex+1,
        IndexUp:this.state.IndexUp+1})
    }
  }

  getRandomMovies=()=>{
   let approvedMovies = this.state.Movies.filter(movie=>movie.status==='approved');
   let randomMovies = {
       Action:'',Comedy:'',Documentary:'',Drama:'',Horror:'','Mystery & Suspense':'',Romance:'','Sci-Fi & Fantasy':''
   };
   if(approvedMovies.length>0){
       for(let gen in randomMovies){
         const genreMovies = [...approvedMovies].filter(approvedMovie =>approvedMovie.tags.includes(gen));
         const randomMovie = genreMovies[Math.floor(Math.random()*genreMovies.length)];
         randomMovies[gen] = randomMovie;
         }
   }
   let savedMovies=[...approvedMovies].filter(approvedMovie=>approvedMovie.saved===true)
   let comingSoon=[...this.state.Movies].filter(movie=>movie.status==='neither')[0]
   if(savedMovies.length>0){
     randomMovies['Saved']=savedMovies[Math.floor(Math.random()*savedMovies.length)]
   }else{
     randomMovies['Saved']=comingSoon
   }
   randomMovies['All']= comingSoon
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


    //console.log('last movie is ...')
    //console.log(this.state.LastMovie)
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
                                scrollGenres={this.state.ScrollGenres}
                                getRandomMovies={this.getRandomMovies}
                                setIndexes={this.setIndexes}/>}/>
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
                                    scrollGenres={this.state.ScrollGenres}
                                    listBy={this.state.ListBy}
                                    sortBy={this.state.SortBy}
                                    setSort={this.setSort}
                                    getRandomMovies={this.getRandomMovies}
                                    redirect = {this.state.Redirect}
                                    handleSaveUnsave={this.handleSaveUnsave}
                                    setRedirectBack={this.setRedirectBack}
                                    setLastMovie={this.setLastMovie}
                                    user = {this.state.User}
                                    genreIndex={this.state.GenreIndex}
                                    indexUp={this.state.IndexUp}
                                    indexDown={this.state.IndexDown}
                                    subtractGenreIndex={this.subtractGenreIndex}
                                    addGenreIndex={this.addGenreIndex}
                                    setIndexes={this.setIndexes}/>}/>

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
