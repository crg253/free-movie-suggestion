import React from "react";
import { Link } from "react-router-dom";

import './HomePage.css';
import GradientsSVG from './SVG/GradientsSVG';
import SkyAndGroundSVG from './SVG/SkyAndGroundSVG';
import DocumentarySVGLink from './SVG/DocumentarySVGLink';
import SciFiSVGLink from './SVG/SciFiSVGLink';
import ActionSVGLink from './SVG/ActionSVGLink.js';
import HorrorSVGLink from './SVG/HorrorSVGLink.js';
import RomanceSVGLink from './SVG/RomanceSVGLink';
import DramaSVGLink from './SVG/DramaSVGLink';
import MysterySuspenseSVGLink from './SVG/MysterySuspenseSVGLink';
import ComedySVGLink from './SVG/ComedySVGLink';


const HomePage = (props) => {
  let randomMovies = {
      Action:'Action',Comedy:'Comedy',Documentary:'',Drama:'',Horror:'',"Mystery & Suspense":'',Romance:'',"Sci-Fi":''};
  if(props.movies.length>0){
      for(let i in props.genres){
      const genreMovies = [...props.movies].filter(movie =>movie.tags.includes(props.genres[i]));
      const randomMovie = genreMovies[Math.floor(Math.random() * genreMovies.length)];
      randomMovies[props.genres[i]]=randomMovie;
      }
  }

  return(
    <div>
      <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
      <svg style={{width:"80%", margin:"2% 10% 2% 10%"}} viewBox="0 0 1920 911">
        <GradientsSVG/>
        <SkyAndGroundSVG/>
        <DocumentarySVGLink randomMovies={randomMovies} chooseGenre={props.chooseGenre}/>
        <SciFiSVGLink randomMovies={randomMovies} chooseGenre={props.chooseGenre}/>
        <ActionSVGLink randomMovies={randomMovies} chooseGenre={props.chooseGenre}/>
        <HorrorSVGLink randomMovies={randomMovies} chooseGenre={props.chooseGenre}/>
        <RomanceSVGLink randomMovies={randomMovies} chooseGenre={props.chooseGenre}/>
        <DramaSVGLink randomMovies={randomMovies} chooseGenre={props.chooseGenre}/>
        <MysterySuspenseSVGLink randomMovies={randomMovies} chooseGenre={props.chooseGenre}/>
        <ComedySVGLink randomMovies={randomMovies} chooseGenre={props.chooseGenre}/>
      </svg>

      <div style={{margin:"0 12% 0 11%",display:"flex", textAlign:"center"}}>
      {props.genres.map(genre=>
        <div style={{margin:"auto"}} onClick={()=>props.chooseGenre(genre)}>
          <Link to={'/' + randomMovies[genre].slug}>{genre}</Link>
        </div>
      )}
      </div>
    </div>
  );
};

export default HomePage;
