import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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

  componentDidUpdate() {
    window.scrollTo(0, 0);
  }


  render() {

    let randomMovies = this.props.getRandomMovies()

    let sign = null;
    if(this.props.listBy ==='Action'){
      sign = <Link to={'/' + randomMovies['Action'].slug}>
              <ActionSign/>
              </Link>
    }else if(this.props.listBy ==='Comedy'){
      sign = <Link to={'/' + randomMovies['Comedy'].slug}>
              <ComedySign/>
              </Link>
    }else if(this.props.listBy ==='Documentary'){
      sign = <Link to={'/' + randomMovies['Documentary'].slug}>
              <DocumentarySign/>
              </Link>
    }else if(this.props.listBy ==='Drama'){
      sign = <Link to={'/' + randomMovies['Drama'].slug}>
              <DramaSign/>
              </Link>
    }else if(this.props.listBy ==='Horror'){
      sign = <Link to={'/' + randomMovies['Horror'].slug}>
              <HorrorSign/>
              </Link>
    }else if(this.props.listBy ==='Mystery & Suspense'){
      sign = <Link to={'/' + randomMovies['Mystery & Suspense'].slug}>
              <MysterySuspenseSign/>
              </Link>
    }else if(this.props.listBy ==='Romance'){
      sign = <Link to={'/' + randomMovies['Romance'].slug}>
              <RomanceSign/>
              </Link>
    }else if(this.props.listBy ==='Sci-Fi'){
      sign = <Link to={'/' + randomMovies['Sci-Fi'].slug}>
              <SciFiSign/>
              </Link>
    }
    return (
      <div id='home-page-container'>
      <Link to={'/'}>
        <h1 id='main-title'>FREE MOVIE SUGGESTION</h1>
      </Link>
      <svg viewBox='0 0 1920 911'>
        <GradientsSVG/>
        <SkyAndGroundSVG/>

        <g onClick={()=>{this.updateInstructions();this.props.chooseListBy('Documentary');}}>
          <Link to={'/'}><DocumentarySVG/></Link></g>

        <g onClick={()=>{this.updateInstructions();this.props.chooseListBy('Sci-Fi');}}>
          <Link to={'/'}><SciFiSVG/></Link></g>

        <g onClick={()=>{this.updateInstructions();this.props.chooseListBy('Horror');}}>
          <Link to={'/'}><HorrorSVG/></Link></g>

        <g onClick={()=>{this.updateInstructions();this.props.chooseListBy('Action');}}>
          <Link to={'/'}><ActionSVG/></Link></g>

        <g onClick={()=>{this.updateInstructions();this.props.chooseListBy('Romance');}}>
          <Link to={'/'}><RomanceSVG/></Link></g>

        <g onClick={()=>{this.updateInstructions();this.props.chooseListBy('Drama');}}>
          <Link to={'/'}><DramaSVG/></Link></g>

        <g onClick={()=>{this.updateInstructions();this.props.chooseListBy('Comedy');}}>
          <Link to={'/'}><ComedySVG/></Link></g>

        <g onClick={()=>{this.updateInstructions();this.props.chooseListBy('Mystery & Suspense');}}>
          <Link to={'/'}><MysterySuspenseSVG/></Link></g>

        {sign}
      </svg>

      <p id='instructions'>{this.state.Instructions}</p>

      </div>


    );
  }
}

export default HomePage;
