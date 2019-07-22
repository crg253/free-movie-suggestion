import React, {Component} from "react";
import {Link} from "react-router-dom";

import "./UserForm.css";

class Contact extends Component {
  state = {
    ContactMessage: ""
  };

  handleContactMessageValueChange = event => {
    this.setState({ContactMessage: event.target.value});
  };

  handleContactMessageSubmit = () => {};

  render() {
    return (
      <div>
        <Link to={"/"}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>
        <div className="user-pages-body-wrapper">
          <h1>Contact</h1>

          <form onSubmit={this.handleContactMessageSubmit}>
            <textarea
              rows="10"
              cols="50"
              style={{
                margin: "20px",
                height: "40vh",
                width: "50vw",
                backgroundColor: "#1F1F1F",
                border: "1px solid grey",
                color: "white",
                fontSize: "18px",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                padding: "20px"
              }}
              type="text"
              value={this.state.ContactMessage}
              onChange={this.handleContactMessageValueChange}
            />
            <input
              className="form-submit-button"
              type="submit"
              value="Submit"
            />
          </form>
        </div>
      </div>
    );
  }
}

export default Contact;
