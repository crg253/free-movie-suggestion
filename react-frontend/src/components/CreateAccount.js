import React, {Component} from "react";
import {Link} from "react-router-dom";

import "./UserForm.css";

class CreateAccount extends Component {
  state = {
    Name: "",
    Password: "",
    Email: "",
    ErrorMessage: "",
    Message: ""
  };

  handleNameChange = event => {
    this.setState({
      Name: event.target.value,
      ErrorMessage: "",
      Message: ""
    });
  };
  handlePasswordChange = event => {
    this.setState({
      Password: event.target.value,
      ErrorMessage: "",
      Message: ""
    });
  };
  handleEmailChange = event => {
    this.setState({
      Email: event.target.value,
      ErrorMessage: "",
      Message: ""
    });
  };
  isDisabled = () => {
      return this.state.Name.length === 0 || this.state.Password.length < 6;
  }

  handleAddUserSubmit = event => {
    event.preventDefault();
    fetch("/api/adduser", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        userName: this.state.Name,
        password: this.state.Password,
        email: this.state.Email
      })
    }).then(res => {
      if (!res.ok) {
        this.setState({
          ErrorMessage: (
            <p style={{fontSize: "18px", color: "red"}}>
              Sorry, username not available.
            </p>
          ),
          Name: "",
          Password: "",
          Email: ""
        });
      } else {
        this.setState({
          Message: (
            <p style={{fontSize: "18px", color: "green"}}>
              Thank you for creating an account.
            </p>
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
              id = 'create-account-username-input'
              type="text"
              placeholder="Username"
              value={this.state.Name}
              onChange={this.handleNameChange}
            />

            <input
              id = 'create-account-password-input'
              type="text"
              placeholder="Password"
              value={this.state.Password}
              onChange={this.handlePasswordChange}
            />

            <input
              id = 'create-account-email-input'
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

            {this.state.ErrorMessage}
            {this.state.Message}
          </form>

          <Link to={"/signin"}>
            <h1>
              /sign
              <span style={{color: "#a9a9a9"}}>in</span>
            </h1>
          </Link>
        </div>
        {/* class="user-pages-body-wrapper"*/}
        <div className="form-footer" />
      </div>
    );
  }
}

export default CreateAccount;
