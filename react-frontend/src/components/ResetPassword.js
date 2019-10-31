import React, {Component} from "react";
import {Link} from "react-router-dom";

import MessageModal from "./MessageModal";

import "./UserForm.css";

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

  isDisabled = () => {
    return this.state.Email.length === 0;
  };

  handlePasswordReset = event => {
    event.preventDefault();
    fetch("/api/resetpassword", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email: this.state.Email})
    }).then(res => {
      if (!res.ok) {
        this.setState({
          Message: (
            <MessageModal
              message="Sorry, email not found."
              buttonMessage="Fine be that way"
            />
          ),
          Email: ""
        });
      } else {
        this.setState({
          Message: (
            <MessageModal
              message="Success. Check email for new password."
              buttonMessage="Awesome"
            />
          ),
          Email: ""
        });
      }
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

          <Link to={"/signin"}>
            <h1>
              /sign<span style={{color: "#a9a9a9"}}>in</span>
            </h1>
          </Link>
        </div>
        {/* class="user-pages-body-wrapper"*/}
        {this.state.Message}
        <div className="form-footer" />
      </div>
    );
  }
}

export default ResetPassword;
