import React, { Component } from 'react';
import { Link } from "react-router-dom";

import './HomePage.css';
import Menu from './Menu'

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

class HomePage extends Component {





  render() {
    let randomMovies = {
        Action:'',Comedy:'',Documentary:'',Drama:'',Horror:'',"Mystery & Suspense":'',Romance:'',"Sci-Fi":''
    };
    if(this.props.movies.length>0){
        for(let i in this.props.genres){
        const genreMovies = [...this.props.movies].filter(movie =>movie.tags.includes(this.props.genres[i]));
        const randomMovie = genreMovies[Math.floor(Math.random() * genreMovies.length)];
        randomMovies[this.props.genres[i]]=randomMovie;
        }
    }

    let sign = null;
    if(this.props.listby ==="Action"){
      sign = <Link to={'/' + randomMovies["Action"].slug}>
              <ActionSign/>
              </Link>
    }else if(this.props.listby ==="Comedy"){
      sign = <Link to={'/' + randomMovies["Comedy"].slug}>
              <ComedySign/>
              </Link>
    }else if(this.props.listby ==="Documentary"){
      sign = <Link to={'/' + randomMovies["Documentary"].slug}>
              <DocumentarySign/>
              </Link>
    }else if(this.props.listby ==="Drama"){
      sign = <Link to={'/' + randomMovies["Drama"].slug}>
              <DramaSign/>
              </Link>
    }else if(this.props.listby ==="Horror"){
      sign = <Link to={'/' + randomMovies["Horror"].slug}>
              <HorrorSign/>
              </Link>
    }else if(this.props.listby ==="Mystery & Suspense"){
      sign = <Link to={'/' + randomMovies["Mystery & Suspense"].slug}>
              <MysterySuspenseSign/>
              </Link>
    }else if(this.props.listby ==="Romance"){
      sign = <Link to={'/' + randomMovies["Romance"].slug}>
              <RomanceSign/>
              </Link>
    }else if(this.props.listby ==="Sci-Fi"){
      sign = <Link to={'/' + randomMovies["Sci-Fi"].slug}>
              <SciFiSign/>
              </Link>
    }
    return (
      <div id="home-page-container">
      <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
      <Menu/>

      <svg viewBox="0 0 1920 911">
        <GradientsSVG/>
        <SkyAndGroundSVG/>
        <a href='#'><g onClick={()=>this.props.chooseGenre("Documentary")}><DocumentarySVG/></g></a>
        <a href='#'><g onClick={()=>this.props.chooseGenre("Sci-Fi")}><SciFiSVG/></g></a>
        <a href='#'><g onClick={()=>this.props.chooseGenre("Horror")}><HorrorSVG/></g></a>
        <a href='#'><g onClick={()=>this.props.chooseGenre("Action")}><ActionSVG/></g></a>
        <a href='#'><g onClick={()=>this.props.chooseGenre("Romance")}><RomanceSVG/></g></a>
        <a href='#'><g onClick={()=>this.props.chooseGenre("Drama")}><DramaSVG/></g></a>
        <a href='#'><g onClick={()=>this.props.chooseGenre("Comedy")}><ComedySVG/></g></a>
        <a href='#'><g onClick={()=>this.props.chooseGenre("Mystery & Suspense")}><MysterySuspenseSVG/></g></a>
        {sign}
      </svg>

      <p id="instructions">*Click on Character to See Genre</p>

      </div>


    );
  }
}

export default HomePage;
