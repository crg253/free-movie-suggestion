import React, {Component} from "react";
import {Link} from "react-router-dom";

import MessageModal from "./MessageModal";
import "./UserForm.css";

class Contact extends Component {
  state = {
    ContactMessage: "",
    ResponseMessage: ""
  };

  handleContactMessageValueChange = event => {
    this.setState({ContactMessage: event.target.value, ResponseMessage: ""});
  };

  handleContactMessageSubmit = event => {
    event.preventDefault();
    fetch("/api/contact_message", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({contactMessage: this.state.ContactMessage})
    }).then(res => {
      this.setState({
        ContactMessage: "",
        ResponseMessage: (
          <MessageModal
            message="Thank you for contacting us."
            buttonMessage="You're Welcome."
          />
        )
      });
    });
  };

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
                border: "1px solid #1F1F1F",
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
          {this.state.ResponseMessage}
        </div>
      </div>
    );
  }
}

export default Contact;
