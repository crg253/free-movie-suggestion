import React, {Component} from "react";
import {Link} from "react-router-dom";

import "./About.css";

class Contact extends Component {
  render() {
    return (
      <div>
        <Link to={"/"}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>
        <div id="about-body">
          <h1 id="about-heading">Contact</h1>
          <p id="about-paragraph">admin@freemoviesuggestion.com</p>
        </div>
        <div id="about-footer" />
      </div>
    );
  }
}

export default Contact;
