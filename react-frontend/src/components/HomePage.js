import React, {Component} from "react";
import {Link} from "react-router-dom";

import "./HomePage.css";

import GradientsSVG from "./SVG/GradientsSVG";
import SkyAndGroundSVG from "./SVG/SkyAndGroundSVG";
import DocumentarySVG from "./SVG/DocumentarySVG";
import SciFiSVG from "./SVG/SciFiSVG";
import ActionSVG from "./SVG/ActionSVG.js";
import HorrorSVG from "./SVG/HorrorSVG.js";
import RomanceSVG from "./SVG/RomanceSVG";
import DramaSVG from "./SVG/DramaSVG";
import MysterySuspenseSVG from "./SVG/MysterySuspenseSVG";
import ComedySVG from "./SVG/ComedySVG";

import DocumentarySign from "./SVG/DocumentarySign";
import ActionSign from "./SVG/ActionSign";
import ComedySign from "./SVG/ComedySign";
import DramaSign from "./SVG/DramaSign";
import HorrorSign from "./SVG/HorrorSign";
import MysterySuspenseSign from "./SVG/MysterySuspenseSign";
import RomanceSign from "./SVG/RomanceSign";
import SciFiSign from "./SVG/SciFiSign";

class HomePage extends Component {
  state = {
    Instructions: "*Click on Character to See Genre"
  };

  updateInstructions = () => {
    this.setState({Instructions: "*Click on Screen for Random Movie"});
  };

  componentDidMount() {
    this.props.setRedirect("");
  }
  // componentDidUpdate() {
  //   window.scrollTo(0, 0);
  // }
  componentWillUnmount() {
    this.props.setSelectedGenre("");
  }

  render() {
    let randomMovies = this.props.getRandomMovies();

    let sign = null;
    if (this.props.selectedGenre === "Action") {
      sign = (
        <g>
          <Link to={"/action/" + randomMovies["Action"].slug}>
            <ActionSign />
          </Link>
        </g>
      );
    } else if (this.props.selectedGenre === "Comedy") {
      sign = (
        <g>
          <Link to={"/comedy/" + randomMovies["Comedy"].slug}>
            <ComedySign />
          </Link>
        </g>
      );
    } else if (this.props.selectedGenre === "Documentary") {
      sign = (
        <g>
          <Link to={"/documentary/" + randomMovies["Documentary"].slug}>
            <DocumentarySign />
          </Link>
        </g>
      );
    } else if (this.props.selectedGenre === "Drama") {
      sign = (
        <g>
          <Link to={"/drama/" + randomMovies["Drama"].slug}>
            <DramaSign />
          </Link>
        </g>
      );
    } else if (this.props.selectedGenre === "Horror") {
      sign = (
        <g>
          <Link to={"/horror/" + randomMovies["Horror"].slug}>
            <HorrorSign />
          </Link>
        </g>
      );
    } else if (this.props.selectedGenre === "Mystery & Suspense") {
      sign = (
        <g>
          <Link
            to={
              "/mysteryandsuspense/" + randomMovies["Mystery & Suspense"].slug
            }
          >
            <MysterySuspenseSign />
          </Link>
        </g>
      );
    } else if (this.props.selectedGenre === "Romance") {
      sign = (
        <g>
          <Link to={"/romance/" + randomMovies["Romance"].slug}>
            <RomanceSign />
          </Link>
        </g>
      );
    } else if (this.props.selectedGenre === "Sci-Fi & Fantasy") {
      sign = (
        <g>
          <Link
            to={"/scifiandfantasy/" + randomMovies["Sci-Fi & Fantasy"].slug}
          >
            <SciFiSign />
          </Link>
        </g>
      );
    }

    return (
      <div id="home-page-container">
        <Link to={"/"}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>
        <svg viewBox="0 0 1920 911">
          <GradientsSVG />
          <SkyAndGroundSVG />

          <g
            onClick={() => {
              this.updateInstructions();
              this.props.setSelectedGenre("Documentary");
            }}
          >
            <Link to={"/"}>
              <DocumentarySVG />
            </Link>
          </g>

          <g
            onClick={() => {
              this.updateInstructions();
              this.props.setSelectedGenre("Sci-Fi & Fantasy");
            }}
          >
            <Link to={"/"}>
              <SciFiSVG />
            </Link>
          </g>

          <g
            onClick={() => {
              this.updateInstructions();
              this.props.setSelectedGenre("Horror");
            }}
          >
            <Link to={"/"}>
              <HorrorSVG />
            </Link>
          </g>

          <g
            id="action-car"
            onClick={() => {
              this.updateInstructions();
              this.props.setSelectedGenre("Action");
            }}
          >
            <Link to={"/"}>
              <ActionSVG />
            </Link>
          </g>

          <g
            onClick={() => {
              this.updateInstructions();
              this.props.setSelectedGenre("Romance");
            }}
          >
            <Link to={"/"}>
              <RomanceSVG />
            </Link>
          </g>

          <g
            onClick={() => {
              this.updateInstructions();
              this.props.setSelectedGenre("Drama");
            }}
          >
            <Link to={"/"}>
              <DramaSVG />
            </Link>
          </g>

          <g
            onClick={() => {
              this.updateInstructions();
              this.props.setSelectedGenre("Comedy");
            }}
          >
            <Link to={"/"}>
              <ComedySVG />
            </Link>
          </g>

          <g
            onClick={() => {
              this.updateInstructions();
              this.props.setSelectedGenre("Mystery & Suspense");
            }}
          >
            <Link to={"/"}>
              <MysterySuspenseSVG />
            </Link>
          </g>

          {sign}
        </svg>

        <p id="instructions">{this.state.Instructions}</p>
        <div id="home-footer" />
      </div>
    );
  }
}

export default HomePage;
