import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';


class Trailer extends Component {

  state={
    Message:'',
    Redirect:''
  }

  handleSaveMovie = (slug) =>{
    fetch('api/savemovie',{
      method:'POST',
      headers:{
        'Authorization':"Bearer " +localStorage.getItem('token'),
        'Content-Type':'application/json'
      },
      body: JSON.stringify({slug: slug})
     })
     .then(res=>{
       if(res.status===401){
         this.props.setUser('')
         this.props.setSavedMovies([])
         this.props.setSignInRedirect(this.props.movieslug)
         this.setState({Redirect:<Redirect to='/signin'/>})
       }else if(res.status ===200){
         res.json()
         .then(res=>{
               this.props.setUser(res.user)
               this.props.setSavedMovies(res.savedMovies)
               this.setState({Message:"Thank you, movie has been saved."})
         })
       }
    })
  }

  getSaveButton = (slug) =>{
    let buttonComponent = ''
    let savedMatches = this.props.savedMovies.filter(savedMovie=>savedMovie.slug===slug)
    if(savedMatches.length>0){
      buttonComponent= 'unsave'
    }else{
      buttonComponent=
      <button
        className="button-nostyle"
        onClick = {()=>this.handleSaveMovie(slug)}
        style={{ fontSize:"18px",topBorder:"10px",color:"#DCDCDC"}}>
            Save</button>
    }
    return buttonComponent
  }

  render() {

    return (
      <div>
        {this.state.Redirect}
        {this.props.movies.filter(movie=>movie.slug===this.props.movieslug)
        .map(selection=>(
          <div
            key={"trailer-and-title-and-save"+selection.slug}
            id="trailer-and-title-and-save">

            <iframe title={selection.name} src={selection.video} allowFullScreen></iframe>

            <div id="title-and-save-button">
              <h2 id="trailer-title" >{selection.name} {selection.year}</h2>

              {this.getSaveButton(selection.slug)}

              <h4>{this.state.Message}</h4>

            </div>
          </div>
        ))}
      </div>

    );
  }
}

export default Trailer;
