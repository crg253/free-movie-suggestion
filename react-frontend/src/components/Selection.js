import React from 'react';

import AppContext from "./AppContext";


const selection = (props) => {

  return(

    <AppContext.Consumer>
      {(context) => context.Movies.filter(movie=>movie.slug === props.movieslug)
        .map(selection=>(
          <div key={selection.slug.concat('video')}
            style={{
              margin:"30px 0 0 40px",
              width: "300px",
            }}>
            <iframe title={selection.name} src = {selection.video}></iframe>
            <h1 >{selection.name} {selection.year}</h1>

            <button
              onClick = {()=>context.saveUnsave(selection.id)}
              style = {{
                width:"20px",
                height:"20px",
                backgroundColor: context.inSaved(selection.id) ? 'purple': 'black'
              }}>
            </button>
          </div>
          ))}
     </AppContext.Consumer>
  );
};

export default selection;
