import React from 'react';


const genres = (props) => {

  return(
    <div>
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

      <p className='sort-selector'>...sort by </p>
      <p
        style = {{
          color: props.sortby==='name' ? 'LawnGreen': 'white'
        }}
        className='sort-selector'
        onClick = {()=>props.setSort("name")}>Title</p>
      <p
        style = {{
          color: props.sortby==='year' ? 'LawnGreen': 'white'
        }}
        className='sort-selector'
        onClick = {()=>props.setSort("year")}>Year</p>
    </div>
  );
};

export default genres;
