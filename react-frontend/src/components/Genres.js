import React from 'react';


const genres = (props) => {

  return(
    <div>
      {props.genres.map(genre=>(
          <p
          style = {{color: props.inlistby(genre) ? 'purple': 'black',
            fontWeight:'bold',
            fontSize: props.inlistby(genre) ? '22px': '18px'}}
          className="genre-links"
          onClick={()=>props.selectBy(genre)}>{genre+" "} </p>
      ))}
      <p
        style = {{color: props.inlistby("Saved") ? 'purple': 'black',
        fontWeight:'bold',
        fontSize: props.inlistby("Saved") ? '22px': '18px'}}
        className="genre-links"
        onClick={()=>props.selectBy("Saved")}>Saved</p>
      <p
        style = {{color: props.inlistby("All") ? 'purple': 'black',
        fontWeight:'bold',
        fontSize: props.inlistby("All") ? '22px': '18px'}}
        className="genre-links"
        onClick={()=>props.selectBy("All")}>All Movies</p>
    </div>
  );
};

export default genres;
