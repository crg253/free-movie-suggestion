import React from 'react';


const trailer = (props) => {

  return(

    props.movies.filter(movie=>movie.slug===props.movieslug)
    .map(selection=>(
      <div>
        <iframe title={selection.name} src={selection.video} allowFullScreen></iframe>
        <div id="title-and-button">
        <h2 >{selection.name} {selection.year}</h2>
        <button id="save-button"
          onClick = {()=>props.saveUnsave(selection.id)}
          style = {{
            backgroundColor: props.inSaved(selection.id) ? 'DarkOrchid': 'black'
          }}>
        </button>
        <p>Save/Unsave</p>
        </div>
      </div>
    ))
  );
};

export default trailer;
