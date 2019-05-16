import React, { Component } from 'react';


class Trailer extends Component {


  handleSaveUnsave = (saveunsave, slug) =>{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let body = JSON.stringify({slug: slug})
    this.props.handleFetch(saveunsave, headers, body)
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
