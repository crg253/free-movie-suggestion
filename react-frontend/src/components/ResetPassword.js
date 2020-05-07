import React, {Component} from "react";
import {Link} from "react-router-dom";

import MessageModal from "./MessageModal";

import "./UserForm.css";
import "./FormLinks.css";

class ResetPassword extends Component {
  state = {
    Email: "",
    Message: ""
  };

  handleEmailChange = event => {
    this.setState({
      Email: event.target.value,
      Message: ""
    });
  };

  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  isDisabled = () => {
    return (
      this.state.Email.length === 0 || !this.validateEmail(this.state.Email)
    );
  };

  handlePasswordReset = event => {
    event.preventDefault();
    fetch("/api/resetpasswordemail", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email: this.state.Email})
    }).then(res => {
      this.setState({
        Message: (
          <MessageModal
            message="Check email to reset password."
            buttonMessage="Awesome"
          />
        ),
        Email: ""
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
          <h1>Reset Password</h1>
          <form onSubmit={this.handlePasswordReset}>
            <input
              type="text"
              placeholder="Email"
              value={this.state.Email}
              onChange={this.handleEmailChange}
            />
            <input
              type="submit"
              value="Submit"
              className="form-submit-button"
              disabled={this.isDisabled()}
            />
          </form>

          <div id="two-links">
            <Link to={"/signin"}>
              <h1 id="first-link">
                /sign<span style={{color: "#a9a9a9"}}>in</span>
              </h1>
            </Link>

            <Link to={"/createaccount"}>
              <h1 id="second-link">
                /create<span style={{color: "#778899"}}>account</span>
              </h1>
            </Link>
          </div>
        </div>
        {/* class="user-pages-body-wrapper"*/}
        {this.state.Message}
        <div className="form-footer" />
      </div>
    );
  }
}

export default ResetPassword;
