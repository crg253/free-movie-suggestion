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
        <div className="about-contact-body">
          <h1 className="about-contact-heading">Contact</h1>
          <h3>Craig</h3>
          <h3>Web Developer</h3>
          <p className="about-contact-paragraph">
            admin@freemoviesuggestion.com
          </p>
          <h3>David John</h3>
          <h3>Graphic Artist</h3>
          <p className="about-contact-paragraph">carrotbunny@gmail.com</p>
        </div>
        <div className="about-contact-footer" />
      </div>
    );
  }
}

export default Contact;
