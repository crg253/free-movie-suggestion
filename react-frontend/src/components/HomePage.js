import React, { Component } from 'react';
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

class HomePage extends Component {

  state={
    Instructions:'*Click on Character to See Genre'
  }

  updateInstructions = () =>{
    this.setState({Instructions:'*Click on Screen for Random Movie'})
  }


  render() {

    let sign = null;
    if(this.props.listby ==="Action"){
      sign = <Link to={'/' + this.props.randomMovies["Action"].slug}>
              <ActionSign/>
              </Link>
    }else if(this.props.listby ==="Comedy"){
      sign = <Link to={'/' + this.props.randomMovies["Comedy"].slug}>
              <ComedySign/>
              </Link>
    }else if(this.props.listby ==="Documentary"){
      sign = <Link to={'/' + this.props.randomMovies["Documentary"].slug}>
              <DocumentarySign/>
              </Link>
    }else if(this.props.listby ==="Drama"){
      sign = <Link to={'/' + this.props.randomMovies["Drama"].slug}>
              <DramaSign/>
              </Link>
    }else if(this.props.listby ==="Horror"){
      sign = <Link to={'/' + this.props.randomMovies["Horror"].slug}>
              <HorrorSign/>
              </Link>
    }else if(this.props.listby ==="Mystery & Suspense"){
      sign = <Link to={'/' + this.props.randomMovies["Mystery & Suspense"].slug}>
              <MysterySuspenseSign/>
              </Link>
    }else if(this.props.listby ==="Romance"){
      sign = <Link to={'/' + this.props.randomMovies["Romance"].slug}>
              <RomanceSign/>
              </Link>
    }else if(this.props.listby ==="Sci-Fi"){
      sign = <Link to={'/' + this.props.randomMovies["Sci-Fi"].slug}>
              <SciFiSign/>
              </Link>
    }
    return (
      <div id="home-page-container">
      <Link to={'/'}>
        <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
      </Link>
      <svg viewBox="0 0 1920 911">
        <GradientsSVG/>
        <SkyAndGroundSVG/>
        <a href='#'><g onClick={()=>{this.updateInstructions();this.props.chooseGenre("Documentary");}}><DocumentarySVG/></g></a>
        <a href='#'><g onClick={()=>{this.updateInstructions();this.props.chooseGenre("Sci-Fi");}}><SciFiSVG/></g></a>
        <a href='#'><g onClick={()=>{this.updateInstructions();this.props.chooseGenre("Horror");}}><HorrorSVG/></g></a>
        <a href='#'><g onClick={()=>{this.updateInstructions();this.props.chooseGenre("Action");}}><ActionSVG/></g></a>
        <a href='#'><g onClick={()=>{this.updateInstructions();this.props.chooseGenre("Romance");}}><RomanceSVG/></g></a>
        <a href='#'><g onClick={()=>{this.updateInstructions();this.props.chooseGenre("Drama");}}><DramaSVG/></g></a>
        <a href='#'><g onClick={()=>{this.updateInstructions();this.props.chooseGenre("Comedy");}}><ComedySVG/></g></a>
        <a href='#'><g onClick={()=>{this.updateInstructions();this.props.chooseGenre("Mystery & Suspense");}}><MysterySuspenseSVG/></g></a>
        {sign}
      </svg>

      <p id="instructions">{this.state.Instructions}</p>

      </div>


    );
  }
}

export default HomePage;
