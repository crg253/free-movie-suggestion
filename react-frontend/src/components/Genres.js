import React from 'react';


const genres = (props) => {

  return(
    <div>
    <div style={{textAlign:"justify",textJustify:"inter-word"}}>
      {props.genres.map(genre=>(
          <p
          style = {{color: props.inlistby(genre) ? 'Aqua': 'white'}}
          className="genre-links"
          onClick={()=>props.selectBy(genre)}>{genre+" "} </p>
      ))}
      <p
        style = {{color: props.inlistby("Saved") ? 'Aqua': 'white'}}
        className="genre-links"
        onClick={()=>props.selectBy("Saved")}>Saved</p>
      <p
        style = {{color: props.inlistby("All") ? 'Aqua': 'white'}}
        className="genre-links"
        onClick={()=>props.selectBy("All")}>All Movies</p>
      <p
        style = {{color: props.inlistby("User Suggestions") ? 'Aqua': 'white'}}
        className="genre-links"
        onClick={()=>props.selectBy("User Suggestions")}>USER SUGGESTIONS</p>
      </div>

      <div id="sort-by-wrapper">
      <p className='sort-selector'>sort by </p>
      <p
        style = {{
          color: props.sortby==='name' ? 'LawnGreen': 'white'
        }}
        className='sort-selector'
        onClick = {()=>props.setSort("name")}>TITLE</p>
      <p
        style = {{
          color: props.sortby==='year' ? 'LawnGreen': 'white'
        }}
        className='sort-selector'
        onClick = {()=>props.setSort("year")}>YEAR</p>
    </div>
    </div>
  );
};

export default genres;
