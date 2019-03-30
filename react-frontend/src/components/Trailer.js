import React from 'react';


const trailer = (props) => {

  return(

    props.movies.filter(movie=>movie.slug===props.movieslug)
    .map(selection=>(
      <div
        style={{
          margin:"30px 0 0 40px",
          width: "300px",
        }}>
        <iframe title={selection.name} src = {selection.video}></iframe>
        <h1 >{selection.name} {selection.year}</h1>

        <button
          onClick = {()=>props.saveUnsave(selection.id)}
          style = {{
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
