import React from 'react';


const genres = (props) => {

  return(
    <div>
      {props.genres.map(genre=>(
          <p
          style = {{color: props.inlistby(genre) ? 'green': 'black'}}
          className="genre-links"
          onClick={()=>props.selectBy(genre)}>{genre+" "} </p>
      ))}
      <p
        style = {{color: props.inlistby("Saved") ? 'green': 'black'}}
        className="genre-links"
        onClick={()=>props.selectBy("Saved")}>Saved</p>
      <p
        style = {{color: props.inlistby("All") ? 'green': 'black'}}
        className="genre-links"
        onClick={()=>props.selectBy("All")}>All Movies</p>
    </div>
  );
};

export default genres;
