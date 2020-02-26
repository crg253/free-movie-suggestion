import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";

import MessageModal from "./MessageModal";

import "./UserForm.css";

class CompleteRegistration extends Component {
  state = {
    Name: "",
    Password: "",
    Message: "",
    Redirect: ""
  };

  handleNameChange = event => {
    this.setState({
      Name: event.target.value,
      Message: ""
    });
  };

  handlePasswordChange = event => {
    this.setState({
      Password: event.target.value,
      Message: ""
    });
  };

  isDisabled = () => {
    return this.state.Name.length === 0 || this.state.Password.length < 6;
  };

  handleNameAndPasswordSubmit = event => {
    event.preventDefault();
    fetch("/api/completeregistration", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: this.state.Name,
        password: this.state.Password,
        emailToken: this.props.match.params.emailtoken
      })
    }).then(res => {
      if (res.status === 400) {
        this.setState({
          Message: (
            <MessageModal
              message="Sorry, not able to process username or password."
              buttonMessage="Fine be that way"
            />
          ),
          Name: "",
          Password: ""
        });
      } else if (res.status === 500) {
        this.setState({
          Message: (
            <MessageModal
              message="Sorry, username not available, or email in use."
              buttonMessage="Fine be that way"
            />
          ),
          Name: "",
          Password: ""
        });
      } else if (res.status === 200) {
        this.setState({
          Redirect: (
            <Redirect
              to={{
                pathname: "/signin",
                state: {
                  message: "Thank you for creating account.",
                  buttonMessage: "You're welcome"
                }
              }}
            />
          ),

          Name: "",
          Password: ""
        });
      }
    });
  };

  render() {
    return (
      <div>
        {this.state.Redirect}
        <Link to={"/"}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>
        <div className="user-pages-body-wrapper">
          <h1>Complete Registration</h1>

          <form onSubmit={this.handleNameAndPasswordSubmit}>
            <input
              data-test="create-account-username-input"
              type="text"
              placeholder="Name"
              value={this.state.Name}
              onChange={this.handleNameChange}
            />
            <input
              data-test="create-account-password-input"
              placeholder="Password"
              type="password"
              value={this.state.Password}
              onChange={this.handlePasswordChange}
            />
            <input
              data-test="create-account-submit-button"
              type="submit"
              value="Submit"
              className="form-submit-button"
              disabled={this.isDisabled()}
            />
          </form>
        </div>
        {/* class="user-pages-body-wrapper"*/}
        <div data-test="create-account-message-modal">{this.state.Message}</div>
        <div className="form-footer" />
      </div>
    );
  }
}

export default CompleteRegistration;
