import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';

import './User.css';

class UserMovies extends Component {


  handleRemoveSuggestion = (slug) =>{
    fetch('/api/removesuggestion',{
      method:'POST',
      headers:{
         'Authorization':"Bearer " +localStorage.getItem('token'),
         'Content-Type':'application/json'
       },
      body: JSON.stringify({slug:slug})
    })
    .then(res=>{
    if (res.status===401) {
      res.json()
       .then(res=>{
         this.props.setUser(res.user)
         this.props.setMovies(res.movies)
         this.props.setRedirectBack('')
         this.props.setRedirectBackSlug('usermovies')
         this.props.setRedirect(<Redirect to='/signin'/>)
      })
    }
    else if (res.status===200){
      res.json()
        .then(res=>{
          this.props.setUser(res.user)
          this.props.setMovies(res.movies)
       })
     }
    })
  }

  handleUnsave = (slug) =>{
    fetch('/api/unsavemovie',{
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
           this.props.setUser(res.user)
           this.props.setMovies(res.movies)
           this.props.setRedirectBack('')
           this.props.setRedirectBackSlug('usermovies')
           this.props.setRedirect(<Redirect to='/signin'/>)
        })
      }
      else if (res.status===200){
        res.json()
          .then(res=>{
            this.props.setUser(res.user)
            this.props.setMovies(res.movies)
         })
       }
    })
  }


  render() {

    function dropThe(slug) {
      if (slug.slice(0,3)==="the"){
        return slug.slice(3,)
      }else{
        return slug
      }
    }

    function compareSlug(a,b) {
    if (dropThe(a.slug) < dropThe(b.slug))
      return -1;
    if (dropThe(a.slug) > dropThe(b.slug))
      return 1;
    return 0;
    }

    let userSaves = this.props.movies.filter(movie=>movie.saved===true)
    userSaves.sort(compareSlug)

    let userSuggestionsTrailers = this.props.movies
                    .filter(movie=>movie.username===this.props.user)
                    .filter(film=>film.video != null)
    userSuggestionsTrailers.sort(compareSlug)

    let userSuggestionsNoTrailers = this.props.movies
                    .filter(movie=>movie.username===this.props.user)
                    .filter(film=>film.video === null)
    userSuggestionsNoTrailers.sort(compareSlug)

    return (
      <div >
        {this.props.redirect}

        <Link to={'/'}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>

        <h2 style={{textAlign:'center'}}>Your Saved Movies</h2>

        <div style={{
                display:'flex',
                flexWrap:'wrap',
                margin:'40px 2.5vw 0 2.5vw'}}>



            {userSaves.map(film=>
              <div key={'usersave'+film.slug}>
                  <iframe
                      style={{
                        border:'0',
                        width:'26.6vw',
                        height:'14.94vw',
                        margin:'0 2.5vw 0 2.5vw'
                      }}
                      title={film.name}
                      src={film.video}
                      allowFullScreen></iframe>

                  <div style={{
                              display:'flex',
                              alignItems:'center',
                              justifyContent:'center'}}>
                  <p>{film.name}</p>
                  <p style={{margin:'0 0 0 10px'}}>{film.year}</p>
                  </div>
                  <div style={{textAlign:'center', margin:'0 0 5px 0'}}>
                  <button onClick={()=>this.handleUnsave(film.slug)} >unsave</button>
                  </div>
              </div>
              )}
        </div>

        <h2 style={{textAlign:'center'}}>Your Suggestions</h2>

        <div style={{
                display:'flex',
                flexWrap:'wrap',
                margin:'40px 2.5vw 0 2.5vw'}}>

                {userSuggestionsTrailers.map(film=>
                  <div key={'usersuggestion'+film.slug}>
                      <iframe
                          style={{
                            border:'0',
                            width:'26.6vw',
                            height:'14.94vw',
                            margin:'0 2.5vw 0 2.5vw'
                          }}
                          title={film.name}
                          src={film.video}
                          allowFullScreen></iframe>

                      <div style={{
                                  display:'flex',
                                  alignItems:'center',
                                  justifyContent:'center'}}>
                      <p>{film.name}</p>
                      <p style={{margin:'0 0 0 10px'}}>{film.year}</p>
                      </div>
                      <div style={{textAlign:'center', margin:'0 0 5px 0'}}>
                      <button onClick={()=>this.handleRemoveSuggestion(film.slug)} >unsuggest</button>
                      </div>
                  </div>
                  )}

            {userSuggestionsNoTrailers.map(film=>
              <div key={'usersuggestion'+film.slug}>
                  <div
                      style={{
                        width:'26.6vw',
                        height:'14.94vw',
                        margin:'0 2.5vw 0 2.5vw',
                        backgroundColor:'grey',
                        textAlign:'center'
                      }}
                    ><p style={{padding:'3vw 0 0 0'}}>Coming</p> <p>Soon</p></div>

                  <div style={{
                              display:'flex',
                              alignItems:'center',
                              justifyContent:'center'}}>
                  <p>{film.name}</p>
                  <p style={{margin:'0 0 0 10px'}}>{film.year}</p>
                  </div>
                  <div style={{textAlign:'center', margin:'0 0 5px 0'}}>
                  <button onClick={()=>this.handleRemoveSuggestion(film.slug)}>unsuggest</button>
                  </div>
              </div>
              )}
        </div>



      </div>
    );
  }
}

export default UserMovies;
