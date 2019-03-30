import React from 'react';

const genres = (props) => {
  return(
    <div>
      <div style={{display:"flex"}}>
        {props.genres.map(genre=>(
          <div style={{marginRight:'10px'}}>
            <p onClick={()=>props.selectBy(genre)}>{genre}</p>
          </div>
        ))}
      </div>

      <div style={{display:"flex"}}>
        <div>
          <p onClick={()=>props.selectBy("Saved")}>Saved</p>
        </div>
        <div style={{marginLeft:"10px"}}>
          <p onClick={()=>props.selectBy("All")}>All Movies</p>
        </div>
      </div>
    </div>
  );
};

export default genres;
