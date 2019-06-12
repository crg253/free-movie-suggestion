import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

import './App.css';
import HomePage from './components/HomePage';
import TrailerPage from './components/TrailerPage';
import SignIn from './components/SignIn';
import AddUser from './components/AddUser';
import Recommend from './components/Recommend';
import Menu from './components/Menu';
import UserMovies from './components/UserMovies';
import UserSuggestions from './components/UserSuggestions'

class App extends Component {

  state = {
    Movies:[],
    SelectedGenre:'',
    SortBy:'name',
    User:'',
    Redirect:'',
    RedirectBackGenre:'',
    RedirectBackSlug:'',
    RedirectBack:'',
    ScrollGenres:['All',
                  'Action',
                  'Comedy',
                  'Documentary',
                  'Drama',
                  'Horror',
                  'Mystery & Suspense',
                  'Romance',
                  'Sci-Fi & Fantasy'],
    GenreIndex:'0',
    IndexUp:'0',
    IndexDown:'0'
  }



  setSelectedGenre = (genre)=>{
    this.setState({SelectedGenre:genre})
  }
  setRedirectBackSlug = (newSlug)=>{
    this.setState({RedirectBackSlug:newSlug})
  }
  setRedirectBackGenre = (newGenre)=>{
    this.setState({RedirectBackGenre:newGenre})
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
  setSort = (sortParam) =>{
   this.setState({SortBy:sortParam})
  }
  setUser = (newUser) =>{
   this.setState({User:newUser});
  }
  setIndexes = (down,index,up)=>{
    this.setState({IndexDown:down,GenreIndex:index,IndexUp:up,})
  }

  changeGenreCase =(toUpperOrLower, genreName)=>{
    if(toUpperOrLower === 'toLower'){
      if(genreName === 'Mystery & Suspense'){
         return 'mysteryandsuspense'
       }else if (genreName === 'Sci-Fi & Fantasy' ){
         return 'scifiandfantasy'
       }else{
         return genreName.toLowerCase()
       }
    }else if (toUpperOrLower==='toUpper') {
      if(genreName === 'mysteryandsuspense'){
        return 'Mystery & Suspense'
      }else if (genreName === 'scifiandfantasy') {
        return 'Sci-Fi & Fantasy'
      }else{
        let upperGenreName = genreName[0].toUpperCase()
        upperGenreName = upperGenreName.concat(genreName.slice(1,))
        return upperGenreName
      }
    }
  }

  subtractGenreIndex=()=>{
    if(this.state.GenreIndex===0){
      this.setState({
        IndexUp:this.state.GenreIndex,
        GenreIndex:8,
        IndexDown:this.state.IndexDown-1})
    }
    else if(this.state.GenreIndex===1){
      this.setState({
        IndexUp:this.state.GenreIndex,
        GenreIndex:this.state.GenreIndex-1,
        IndexDown:8})
    }else{
      this.setState({
        IndexUp:this.state.GenreIndex,
        GenreIndex:this.state.GenreIndex-1,
        IndexDown:this.state.IndexDown-1})
    }
  }

  addGenreIndex=()=>{
    if(this.state.GenreIndex===8){
      this.setState({
        IndexDown:this.state.GenreIndex,
        GenreIndex:0,
        IndexUp:this.state.IndexUp+1})
    }
    else if (this.state.GenreIndex===7){
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


  handleSaveUnsave = (saveunsave, genre, slug) =>{
    fetch('/api/'.concat(saveunsave),{
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
              RedirectBackGenre:genre,
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

  getSaveButton = (genreSlug, movieSlug) =>{
    let buttonComponent = ''
    let allMovies = [...this.state.Movies]
    let selectedMovie = allMovies.filter(movie=>movie.slug===movieSlug)[0]
    if (selectedMovie.slug === "comingsoon"){
      buttonComponent = ''
    }
    else if(selectedMovie.saved===true){
      buttonComponent=
        <button
          className="button-nostyle"
          onClick = {()=>this.handleSaveUnsave('unsavemovie', genreSlug, movieSlug)}
          style={{ fontSize:"18px",topBorder:"10px",color:"#DCDCDC"}}>
              Unsave</button>
    }else if(selectedMovie.saved ===false){
      buttonComponent=
        <button
          className="button-nostyle"
          onClick = {()=>this.handleSaveUnsave('savemovie', genreSlug, movieSlug)}
          style={{ fontSize:"18px",topBorder:"10px",color:"#DCDCDC"}}>
              Save</button>
    }
    return buttonComponent
  }

   handleInitialFetch = () => {
     fetch('/api/checktoken',{
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


    // console.log(this.changeGenreCase('toLower', 'Mystery & Suspense'))
    // console.log(this.changeGenreCase('toLower', 'Sci-Fi & Fantasy'))
    // console.log(this.changeGenreCase('toLower', 'Drama'))
    // console.log(this.changeGenreCase('toUpper', 'mysteryandsuspense'))
    // console.log(this.changeGenreCase('toUpper', 'scifiandfantasy'))
    // console.log(this.changeGenreCase('toUpper', 'drama'))

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
                                setUser={this.setUser}
                                setMovies={this.setMovies}
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
                              setRedirectBack={this.setRedirectBack}
                              setRedirectBackSlug={this.setRedirectBackSlug}/>}/>

            <Route
              path='/usersuggestions'
              render={(props)=><UserSuggestions
                                {...props}
                                setUser={this.setUser}
                                setMovies={this.setMovies}
                                setRedirectBack={this.setRedirectBack}
                                setRedirectBackSlug={this.setRedirectBackSlug}
                                setRedirect={this.setRedirect}
                                movies = {this.state.Movies}/>}/>

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
                                    setRedirectBackSlug={this.setRedirectBackSlug}
                                    redirectBackGenre={this.state.RedirectBackGenre}
                                    setRedirectBackGenre={this.setRedirectBackGenre}/>}/>

            <Route
              path='/adduser'
              render = {(props)=><AddUser
                                    {...props}/>}/>

            <Route
              path='/:genreslug/:movieslug'
              render={(props)=> <TrailerPage
                                    {...props}
                                    movies = {this.state.Movies}
                                    scrollGenres={this.state.ScrollGenres}
                                    sortBy={this.state.SortBy}
                                    setSort={this.setSort}
                                    getRandomMovies={this.getRandomMovies}
                                    redirect = {this.state.Redirect}
                                    handleSaveUnsave={this.handleSaveUnsave}
                                    setRedirectBack={this.setRedirectBack}
                                    user = {this.state.User}
                                    genreIndex={this.state.GenreIndex}
                                    indexUp={this.state.IndexUp}
                                    indexDown={this.state.IndexDown}
                                    subtractGenreIndex={this.subtractGenreIndex}
                                    addGenreIndex={this.addGenreIndex}
                                    setIndexes={this.setIndexes}
                                    changeGenreCase={this.changeGenreCase}
                                    setSelectedGenre = {this.setSelectedGenre}
                                    getSaveButton= {this.getSaveButton}/>}/>

            <Route
              path='/'
              render={(props)=> <HomePage
                                  {...props}
                                  setSelectedGenre = {this.setSelectedGenre}
                                  selectedGenre= {this.state.SelectedGenre}
                                  getRandomMovies={this.getRandomMovies}/>}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
