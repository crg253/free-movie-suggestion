import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';


class Trailer extends Component {

  state={
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
         this.setState({Redirect:<Redirect to='/signin'/>})
       }
    })
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

              <button
                className="button-nostyle"
                onClick = {()=>this.handleSaveMovie(selection.slug)}
                style={{ fontSize:"18px",topBorder:"10px",color:"#DCDCDC"}}>
                    Save</button>

            </div>
          </div>
        ))}
      </div>

    );
  }
}

export default Trailer;
