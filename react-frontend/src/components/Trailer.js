import React from 'react';


const trailer = (props) => {

  return(

    props.movies.filter(movie=>movie.slug===props.movieslug)
    .map(selection=>(
      <div style={{marginLeft:"auto", marginRight:"auto"}}>
        <div id="trailer">
          <iframe title={selection.name} src = {selection.video}></iframe>
        </div>
        <p >{selection.name} {selection.year}</p>

        <button
          onClick = {()=>props.saveUnsave(selection.id)}
          style = {{
            border:"1px solid green",
            width:"20px",
            height:"20px",
            backgroundColor: props.inSaved(selection.id) ? 'purple': 'black'
          }}>
        </button>
        <p>Save/Unsave</p>

      </div>
    ))
  );
};

export default trailer;
