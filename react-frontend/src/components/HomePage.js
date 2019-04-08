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

import DocumentarySign from './SVG/DocumentarySign';
import ActionSign from './SVG/ActionSign';
import ComedySign from './SVG/ComedySign';
import DramaSign from './SVG/DramaSign';
import HorrorSign from './SVG/HorrorSign';
import MysterySuspenseSign from './SVG/MysterySuspenseSign';
import RomanceSign from './SVG/RomanceSign';
import SciFiSign from './SVG/SciFiSign';




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

  let sign = null;
  if(props.listby ==="Action"){
    sign = <Link to={'/' + randomMovies["Action"].slug}>
            <ActionSign/>
            </Link>
  }else if(props.listby ==="Comedy"){
    sign = <Link to={'/' + randomMovies["Comedy"].slug}>
            <ComedySign/>
            </Link>
  }else if(props.listby ==="Documentary"){
    sign = <Link to={'/' + randomMovies["Documentary"].slug}>
            <DocumentarySign/>
            </Link>
  }else if(props.listby ==="Drama"){
    sign = <Link to={'/' + randomMovies["Drama"].slug}>
            <DramaSign/>
            </Link>
  }else if(props.listby ==="Horror"){
    sign = <Link to={'/' + randomMovies["Horror"].slug}>
            <HorrorSign/>
            </Link>
  }else if(props.listby ==="Mystery & Suspense"){
    sign = <Link to={'/' + randomMovies["Mystery & Suspense"].slug}>
            <MysterySuspenseSign/>
            </Link>
  }else if(props.listby ==="Romance"){
    sign = <Link to={'/' + randomMovies["Romance"].slug}>
            <RomanceSign/>
            </Link>
  }else if(props.listby ==="Sci-Fi"){
    sign = <Link to={'/' + randomMovies["Sci-Fi"].slug}>
            <SciFiSign/>
            </Link>
  }



  return(
    <div id="home-page-container">
      <h1 id="main-title">FREE MOVIE SUGGESTION</h1>

      <svg viewBox="0 0 1920 911">
        <GradientsSVG/>
        <SkyAndGroundSVG/>
        <g onClick={()=>props.chooseGenre("Documentary")}><DocumentarySVG/></g>
        <g onClick={()=>props.chooseGenre("Sci-Fi")}><SciFiSVG/></g>
        <g onClick={()=>props.chooseGenre("Horror")}><HorrorSVG/></g>
        <g onClick={()=>props.chooseGenre("Action")}><ActionSVG/></g>
        <g onClick={()=>props.chooseGenre("Romance")}><RomanceSVG/></g>
        <g onClick={()=>props.chooseGenre("Drama")}><DramaSVG/></g>
        <g onClick={()=>props.chooseGenre("Comedy")}><ComedySVG/></g>
        <g onClick={()=>props.chooseGenre("Mystery & Suspense")}><MysterySuspenseSVG/></g>
        {sign}
      </svg>


      <div id="random-genre-list" >
      {props.genres.map(genre=>
        <div className="random-genre-link" onClick={()=>props.chooseGenre(genre)}>
          <Link to={'/' + randomMovies[genre].slug}>{genre}</Link>
        </div>
      )}
      </div>
    </div>
  );
};

export default HomePage;
