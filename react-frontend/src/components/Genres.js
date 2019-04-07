import React from 'react';


const genres = (props) => {

  return(
    <div>
      <div>
        {props.genres.map(genre=>(
            <p className="genre-list-link" onClick={()=>props.selectBy(genre)}>{genre+" "} </p>
        ))}
      </div>

      <div id="saved-all-list-links">
        <p className="genre-list-link" onClick={()=>props.selectBy("Saved")}>Saved</p>
        <p className="genre-list-link" onClick={()=>props.selectBy("All")}>All Movies</p>
      </div>
    </div>
  );
};

export default genres;
