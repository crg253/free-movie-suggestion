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
      <div
        key={"trailer-and-title-and-save"+selection.slug}
        id="trailer-and-title-and-save">

        <iframe title={selection.name} src={selection.video} allowFullScreen></iframe>

        <div id="title-and-save-button">
          <h2 id="trailer-title" >{selection.name} {selection.year}</h2>

          <button
            className="button-nostyle"
            onClick = {()=>props.saveUnsave(selection.slug)}
            style={{ fontSize:"18px",topBorder:"10px",color:"#DCDCDC"}}>
                {saveUnsaveButton}</button>


        </div>
      </div>
    ))
  );
};

export default trailer;
