import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import './About.css';

class About extends Component {

  render() {
    return (
      <div>
        <Link to={'/'}>
          <h1 id='main-title'>FREE MOVIE SUGGESTION</h1>
        </Link>
        <div id='about-body'>
          <h1 id='about-heading'>About</h1>
          <p id='about-paragraph'>Hey Everyone, welcome to the website...
          that I have worked entirely too long on.
          It's here.
          Finally.
          It's a bunch of trailers.
          I hope you like watching trailers, lol.
          No seriously, I hope you do like the site.
          I worked pretty hard on it.
          These are my favorite movies.
          I hope you find something that you like.
          The main improvement with this second version of the website is that
          now you can recommend movies as well.
          I hope you do.
          That's the part that I'm looking forward to the most.
          I would really appreciate any input that you are able to give...
          Ok well, thanks for checking it out.
          Have fun and please let me know if you have any problems with the site.</p>
          <p>- Craig</p>
        </div>
        <div id='about-footer'></div>

      </div>
    );
  }
}

export default About;
