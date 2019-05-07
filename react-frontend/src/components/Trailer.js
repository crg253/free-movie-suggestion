import React from 'react';


const trailer = (props) => {

  let saveUnsaveButton = ''
  if (!localStorage.getItem(props.movieslug)){
    saveUnsaveButton = 'Save'
  }else if (localStorage.getItem(props.movieslug)==='unsaved') {
    saveUnsaveButton = 'Save'
  }else{
    saveUnsaveButton = 'Unsave'
  }

  return(
    props.movies.filter(movie=>movie.slug===props.movieslug)
    .map(selection=>(
      <div id="trailer-and-title-and-save">

        <iframe title={selection.name} src={selection.video} allowFullScreen></iframe>

        <div id="title-and-save-button">
          <h2 id="trailer-title" >{selection.name} {selection.year}</h2>

          <a
            href="javascript:void(0);"
            onClick = {()=>props.saveUnsave(selection.slug)}
            style={{ topBorder:"10px",color:"#DCDCDC"}}
            >{saveUnsaveButton} </a>

        </div>
      </div>
    ))
  );
};

export default trailer;
