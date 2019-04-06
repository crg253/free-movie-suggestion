import React from "react";
import { Link } from "react-router-dom";

import './TrailerPage.css';
import Trailer from './Trailer';
import Genres from './Genres';
import SelectedList from './SelectedList';

const TrailerPage = (props) => {

  return(
      <div style={{display:"flex"}} >



        <div id="trailer-stuff-wrapper">

          <div id="mobile-genre-link">
            <p>{props.listby}</p>
            <p><Link to={'/list'}>List</Link></p>
          </div>

          <Trailer
              movieslug={props.match.params.movieslug}
              movies={props.movies}
              saveUnsave={props.saveUnsave}
              inSaved={props.inSaved}/>
        </div>


        <div className = "List" style={{margin:"60px 0 0 0"}}>
          <Genres
                genres={props.genres}
                selectBy={props.selectBy}
                listby={props.listby}/>
          <SelectedList
                movies ={props.movies}
                savedmovies={props.savedmovies}
                unsave = {props.unsave}
                genres ={props.genres}
                listby={props.listby}/>
        </div>


    </div>
  );
};

export default TrailerPage;
