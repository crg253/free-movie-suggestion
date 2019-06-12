import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";

class UserSuggestions extends Component {


  handleSaveUnsaveUserMov = (saveunsave, slug) =>{
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
           this.props.setUser(res.user)
           this.props.setMovies(res.movies)
           this.props.setRedirectBack('')
           this.props.setRedirectBackSlug('usersuggestions')
           this.props.setRedirect(<Redirect to='signin'/>)
          })
      }else if (res.status===200){
        res.json()
        .then(res=>{
          this.props.setUser(res.user)
          this.props.setMovies(res.movies)
         })
      }
    })
  }

  getUserMovSaveButton = (movieSlug) =>{
    let buttonComponent = ''
    let selectedMovie = this.props.movies.filter(movie=>movie.slug===movieSlug)[0]
    if(selectedMovie.saved===true){
      buttonComponent=
        <button
          onClick = {()=>this.handleSaveUnsaveUserMov('unsavemovie', movieSlug)}
        >
              Unsave</button>
    }else if(selectedMovie.saved ===false){
      buttonComponent=
        <button
          onClick = {()=>this.handleSaveUnsaveUserMov('savemovie', movieSlug)}
          >
              Save</button>
    }
    return buttonComponent
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

    let allUserSuggestionsTrailers = this.props.movies
                    .filter(movie=>movie.username!=='crg253')
                    .filter(film=>film.video != null)
    allUserSuggestionsTrailers.sort(compareSlug)

    let allUserSuggestionsNoTrailers = this.props.movies
                    .filter(movie=>movie.username!=='crg253')
                    .filter(film=>film.video === null)
    allUserSuggestionsNoTrailers.sort(compareSlug)




    return (
      <div>
        <Link to={'/'}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>

        <div style={{
                display:'flex',
                flexWrap:'wrap',
                margin:'40px 2.5vw 0 2.5vw'}}>

                {allUserSuggestionsTrailers.map(film=>
                  <div
                    key={'usersuggestion'+film.slug}
                    >
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
                                  justifyContent:'center',
                                  margin:'5px'}}>
                        <p style={{margin:'0'}}>{film.name}</p>
                        <p style={{margin:'0 0 0 10px'}}>{film.year}</p>
                      </div>
                      <p style={{
                        margin:'5px',
                        textAlign:'center',
                        }}>suggested by {film.username}</p>
                      <div style={{textAlign:'center', margin:'0 0 5px 0'}}>
                      {this.getUserMovSaveButton(film.slug)}
                      </div>
                  </div>
                  )}

            {allUserSuggestionsNoTrailers.map(film=>
              <div
                key={'usersuggestion'+film.slug}
                >
                  <div
                      style={{
                        borderTop:'1px solid black',
                        width:'26.6vw',
                        height:'14.94vw',
                        margin:'0 2.5vw 0 2.5vw',
                        backgroundColor:'grey',
                        textAlign:'center'
                      }}
                    >
                    <p style={{padding:'3vw 0 0 0'}}>Coming</p> <p>Soon</p></div>

                  <div style={{
                              display:'flex',
                              alignItems:'center',
                              justifyContent:'center',
                              margin:'5px'}}>
                  <p style={{margin:'0'}}>{film.name}</p>
                  <p style={{margin:'0 0 0 10px'}}>{film.year}</p>
                  </div>
                  <p style={{textAlign:'center', margin:'5px 5px 40px 5px'}}>suggested by {film.username}</p>

                  <div style={{textAlign:'center', margin:'0 0 5px 0'}}>
                  </div>
              </div>
              )}
        </div>

      </div>
    );
  }
}

export default UserSuggestions;
