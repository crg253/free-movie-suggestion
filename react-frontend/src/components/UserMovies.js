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
         this.props.setRedirect(<Redirect to='signin'/>)
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
           this.props.setRedirect(<Redirect to='signin'/>)
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
    return (
      <div >
        {this.props.redirect}

        <Link to={'/'}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>

        <div style={{
                display:'flex',
                flexWrap:'wrap',
                margin:'40px 2.5vw 0 2.5vw'}}>


            {this.props.movies.filter(movie=>movie.saved===true)
            .map(film=>
              <div key={'usersuggestion'+film.slug}>
                  <iframe
                      style={{
                        width:'26.2vw',
                        height:'14.72vw',
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


        <div style={{
                display:'flex',
                flexWrap:'wrap',
                margin:'40px 2.5vw 0 2.5vw'}}>


            {this.props.movies.filter(movie=>movie.username===this.props.user)
            .map(film=>
              <div key={'usersuggestion'+film.slug}>
                  <div
                      style={{
                        width:'26.2vw',
                        height:'14.72vw',
                        margin:'0 2.5vw 0 2.5vw',
                        backgroundColor:'white'
                      }}
                    ></div>

                  <div style={{
                              display:'flex',
                              alignItems:'center',
                              justifyContent:'center'}}>
                  <p>{film.name}</p>
                  <p style={{margin:'0 0 0 10px'}}>{film.year}</p>
                  </div>
                  <div style={{textAlign:'center', margin:'0 0 5px 0'}}>
                  <button>unsuggest</button>
                  </div>
              </div>
              )}
        </div>



      </div>
    );
  }
}

export default UserMovies;
