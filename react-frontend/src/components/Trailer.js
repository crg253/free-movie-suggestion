import React from 'react';


const trailer = (props) => {

  return(

    props.movies.filter(movie=>movie.slug===props.movieslug)
    .map(selection=>(
      <div>
        <div id="trailer-div">
          <iframe title={selection.name} src = {selection.video}></iframe>
        </div>
        <p >{selection.name} {selection.year}</p>

        <button id="trailer-save-button"
          onClick = {()=>props.saveUnsave(selection.id)}
          style = {{
            backgroundColor: props.inSaved(selection.id) ? 'purple': 'black'
          }}>
        </button>
        <p>Save/Unsave</p>

      </div>
    ))
  );
};

export default trailer;
