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
    this.setState({
      ContactMessage: event.target.value,
      ResponseMessage: ""
    });
  };

  isDisabled = () => {
    return this.state.ContactMessage.length === 0;
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
    console.log(this.state.BoxWidth);
    return (
      <div>
        <Link to={"/"}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>
        <div className="user-pages-body-wrapper">
          <h1>Contact</h1>

          <form onSubmit={this.handleContactMessageSubmit}>
            <textarea
              placeholder="Type message here..."
              id="contact-message-text-area"
              type="text"
              value={this.state.ContactMessage}
              onChange={this.handleContactMessageValueChange}
            />
            <input
              className="form-submit-button"
              type="submit"
              value="Submit"
              disabled={this.isDisabled()}
            />
          </form>
          {this.state.ResponseMessage}
        </div>
        <div className="form-footer" />
      </div>
    );
  }
}

export default Contact;
