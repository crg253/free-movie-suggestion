import React from 'react';


const genres = (props) => {

  return(
    <div>
      {props.genres.map(genre=>(
          <p className="genre-links" onClick={()=>props.selectBy(genre)}>{genre+" "} </p>
      ))}
      <p className="genre-links" onClick={()=>props.selectBy("Saved")}>Saved</p>
      <p className="genre-links" onClick={()=>props.selectBy("All")}>All Movies</p>
    </div>
  );
};

export default genres;
