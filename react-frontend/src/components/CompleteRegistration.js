import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";

import MessageModal from "./MessageModal";

import "./UserForm.css";
import "./FormLinks.css";

class CompleteRegistration extends Component {
  state = {
    Name: "",
    Password1: "",
    Password2: "",
    Message: "",
    Redirect: ""
  };

  handleNameChange = event => {
    this.setState({
      Name: event.target.value,
      Message: ""
    });
  };

  handlePassword1Change = event => {
    this.setState({
      Password1: event.target.value,
      Message: ""
    });
  };

  handlePassword2Change = event => {
    this.setState({
      Password2: event.target.value,
      Message: ""
    });
  };

  isDisabled = () => {
    return (
      this.state.Name.length === 0 ||
      this.state.Password1.length < 6 ||
      this.state.Password1 !== this.state.Password2
    );
  };

  handleNameAndPasswordSubmit = event => {
    event.preventDefault();
    fetch("/api/completeregistration", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: this.state.Name,
        password: this.state.Password1,
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
          Password1: "",
          Password2: ""
        });
      } else if (res.status === 500) {
        this.setState({
          Message: (
            <MessageModal
              message="Sorry, username or email in use."
              buttonMessage="Fine be that way"
            />
          ),
          Name: "",
          Password1: "",
          Password2: ""
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
          Password1: "",
          Password2: ""
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
              data-test="create-account-password-input-1"
              placeholder="Password"
              type="password"
              value={this.state.Password1}
              onChange={this.handlePassword1Change}
            />
            <input
              data-test="create-account-password-input-2"
              placeholder="Password"
              type="password"
              value={this.state.Password2}
              onChange={this.handlePassword2Change}
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
