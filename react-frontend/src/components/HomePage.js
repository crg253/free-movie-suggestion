import React from "react";
import { Link } from "react-router-dom";

import './HomePage.css';
import GradientsSVG from './SVG/GradientsSVG';
import SkyAndGroundSVG from './SVG/SkyAndGroundSVG';
import DocumentarySVG from './SVG/DocumentarySVG';
import SciFiSVG from './SVG/SciFiSVG';
import ActionSVG from './SVG/ActionSVG.js';
import HorrorSVG from './SVG/HorrorSVG.js';
import RomanceSVG from './SVG/RomanceSVG';
import DramaSVG from './SVG/DramaSVG';
import MysterySuspenseSVG from './SVG/MysterySuspenseSVG';
import ComedySVG from './SVG/ComedySVG';


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
        <Link to={'/' + randomMovies["Documentary"].slug}>
            <DocumentarySVG chooseGenre={props.chooseGenre}/></Link>
        <Link to={'/' + randomMovies["Sci-Fi"].slug}>
            <SciFiSVG chooseGenre={props.chooseGenre} /></Link>
        <Link to={'/' + randomMovies["Action"].slug}>
            <ActionSVG chooseGenre={props.chooseGenre} /></Link>
        <Link to={'/' + randomMovies["Horror"].slug}>
          <HorrorSVG chooseGenre={props.chooseGenre}/></Link>
        <Link to={'/' + randomMovies["Romance"].slug}>
          <RomanceSVG chooseGenre={props.chooseGenre}/></Link>
        <Link to={'/' + randomMovies["Drama"].slug}>
          <DramaSVG chooseGenre={props.chooseGenre}/></Link>
        <Link to={'/' + randomMovies["Mystery & Suspense"].slug}>
          <MysterySuspenseSVG chooseGenre={props.chooseGenre}/></Link>
        <Link to={'/' + randomMovies["Comedy"].slug}>
          <ComedySVG chooseGenre={props.chooseGenre}/></Link>
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
