import React, { Component } from 'react';
import { Redirect } from "react-router-dom";


class Trailer extends Component {


  handleSaveUnsave = (saveunsave, slug) =>{

    fetch('api/'.concat(saveunsave),{
      method:'POST',
      headers: {
        'Authorization':"Bearer " +localStorage.getItem('token')
      },
      body: JSON.stringify({slug: slug})
    })
    .then(res=>{
      if (res.status===401) {
        res.json()
         .then(res=>{
           this.props.setUser(res.user)
           this.props.setMovies(res.movies)
           this.props.setRedirect(<Redirect to="/signin"/>)
           this.props.setRedirectBack('')
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

  getSaveButton = (slug) =>{
    let buttonComponent = ''
    let selectedMovie = this.props.movies.filter(movie=>movie.slug===slug)[0]
    if(selectedMovie.saved===true){
      buttonComponent=
        <button
          className="button-nostyle"
          onClick = {()=>this.handleSaveUnsave('unsavemovie',selectedMovie.slug)}
          style={{ fontSize:"18px",topBorder:"10px",color:"#DCDCDC"}}>
              Unsave</button>
    }else{
      buttonComponent=
        <button
          className="button-nostyle"
          onClick = {()=>this.handleSaveUnsave('savemovie',selectedMovie.slug)}
          style={{ fontSize:"18px",topBorder:"10px",color:"#DCDCDC"}}>
              Save</button>
    }
    return buttonComponent
  }

  render() {

    return (
      <div>
      {this.props.redirect}
        {this.props.movies.filter(movie=>movie.slug===this.props.movieslug)
        .map(selection=>(
          <div
            key={"trailer-and-title-and-save"+selection.slug}
            id="trailer-and-title-and-save">

            <iframe title={selection.name} src={selection.video} allowFullScreen></iframe>

            <div id="title-and-save-button">
              <h2 id="trailer-title" >{selection.name} {selection.year}</h2>

              {this.getSaveButton(selection.slug)}

            </div>
          </div>
        ))}
      </div>

    );
  }
}

export default Trailer;
