import React, { Component } from 'react';


class Trailer extends Component {


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

              {this.props.getSaveButton(this.props.genreslug, selection.slug)}

            </div>
          </div>
        ))}
      </div>

    );
  }
}

export default Trailer;
