import React, {Component} from "react";
import {Link} from "react-router-dom";

import "./AboutContact.css";

class Contact extends Component {
  render() {
    return (
      <div>
        <Link to={"/"}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>
        <div id="about-contact-body">
          <h1 id="about-contact-heading">Contact</h1>
          <p id="about-contact-paragraph">admin@freemoviesuggestion.com</p>
        </div>
        <div id="about-contact-footer" />
      </div>
    );
  }
}

export default Contact;
