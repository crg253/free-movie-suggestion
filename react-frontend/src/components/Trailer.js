import React, { Component } from 'react';


class Trailer extends Component {


  getSaveButton = (slug) =>{
    let buttonComponent = ''
    let selectedMovie = this.props.movies.filter(movie=>movie.slug===slug)[0]
    if(selectedMovie.saved===true){
      buttonComponent=
        <button
          className="button-nostyle"
          onClick = {()=>this.props.handleSaveUnsave('unsavemovie',slug)}
          style={{ fontSize:"18px",topBorder:"10px",color:"#DCDCDC"}}>
              Unsave</button>
    }else{
      buttonComponent=
        <button
          className="button-nostyle"
          onClick = {()=>this.props.handleSaveUnsave('savemovie', slug)}
          style={{ fontSize:"18px",topBorder:"10px",color:"#DCDCDC"}}>
              Save</button>
    }
    return buttonComponent
  }

  render() {

    return (
      <div>
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
