import React, {Component} from "react";
import {Link} from "react-router-dom";

import MessageModal from "./MessageModal";

import "./UserForm.css";

class CreateAccount extends Component {
  state = {
    Name: "",
    Password: "",
    Email: "",
    Message: ""
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
  handleEmailChange = event => {
    this.setState({
      Email: event.target.value,
      Message: ""
    });
  };
  isDisabled = () => {
    return this.state.Name.length === 0 || this.state.Password.length < 6;
  };

  handleAddUserSubmit = event => {
    event.preventDefault();
    fetch("/api/createaccount", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: this.state.Name,
        password: this.state.Password,
        email: this.state.Email
      })
    }).then(res => {
      if (!res.ok) {
        this.setState({
          Message: (
            <MessageModal
              message="Sorry, username not available."
              buttonMessage="Fine be that way"
            />
          ),
          Name: "",
          Password: "",
          Email: ""
        });
      } else {
        this.setState({
          Message: (
            <MessageModal
              message="Thank you for creating account."
              buttonMessage="You're welcome"
            />
          ),
          Name: "",
          Password: "",
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
          <h1>Create Account</h1>

          <form onSubmit={this.handleAddUserSubmit}>
            <input
              data-test="create-account-username-input"
              type="text"
              placeholder="Name"
              value={this.state.Name}
              onChange={this.handleNameChange}
            />

            <input
              id="create-account-email-input"
              type="text"
              placeholder="Email"
              value={this.state.Email}
              onChange={this.handleEmailChange}
            />

            <input
              data-test="create-account-password-input"
              type="text"
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

          <Link data-test="create-account-signin-link" to={"/signin"}>
            <h1>
              /sign
              <span style={{color: "#a9a9a9"}}>in</span>
            </h1>
          </Link>
        </div>
        {/* class="user-pages-body-wrapper"*/}
        <div data-test="create-account-message-modal">{this.state.Message}</div>
        <div className="form-footer" />
      </div>
    );
  }
}

export default CreateAccount;
