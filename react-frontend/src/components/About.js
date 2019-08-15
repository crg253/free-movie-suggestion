import React, {Component} from "react";
import {Link} from "react-router-dom";

import "./AboutContact.css";

class About extends Component {
  render() {
    return (
      <div>
        <Link to={"/"}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>
        <div className="about-contact-body">
          <h1 className="about-contact-heading">About</h1>
          <p className="about-contact-paragraph">
            Hey Everyone, welcome to the website... that I have worked entirely
            too long on. It's here. Finally. It's a bunch of trailers. I hope
            you like watching trailers, lol. No seriously, I hope you do like
            the site. I worked pretty hard on it. These are my favorite movies.
            I hope you find something that you like. There are two main
            improvements with this second version of the website. First, I now
            have this amazing SVG graphic on the home page. Thank you so much
            David John for the drawing. You can reach David at
            carrotbunny@gmail.com. Secondly, You the user are now able to
            recommend movies as well. I hope you do. That's the part that I'm
            looking forward to the most. I would really appreciate any input
            that you are able to give... Ok well, thanks for checking it out.
            Have fun and please let me know if you have any problems with the
            site at admin@freemoviesuggestion.com
          </p>
          <h3>- Craig</h3>
        </div>
        <div className="about-contact-footer" />
      </div>
    );
  }
}

export default About;
