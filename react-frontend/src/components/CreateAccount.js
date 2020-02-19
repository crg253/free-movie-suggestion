import React, {Component} from "react";
import {Link} from "react-router-dom";

import MessageModal from "./MessageModal";

import "./UserForm.css";

class CreateAccount extends Component {
  state = {
    Email: "",
    EmailToken: "",
    Name: "",
    Password: "",
    Message: ""
  };

  handleEmailChange = event => {
    this.setState({
      Email: event.target.value,
      Message: ""
    });
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

  submitEmailIsDisabled = () => {
    return this.state.Email.length === 0;
  };

  isDisabled = () => {
    return this.state.Name.length === 0 || this.state.Password.length < 6;
  };

  handleSubmitEmail = event => {
    event.preventDefault();
    fetch("/api/submitemail", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        email: this.state.Email
      })
    }).then(res => {
      if (res.status === 400) {
        this.setState({
          Message: (
            <MessageModal
              message="Sorry, email format is incorrect."
              buttonMessage="Fine be that way"
            />
          ),
          Email: ""
        });
      } else if (res.status === 500) {
        this.setState({
          Message: (
            <MessageModal
              message="Sorry, email in use."
              buttonMessage="Fine be that way"
            />
          ),
          Email: ""
        });
      } else if (res.status === 200) {
        this.setState({
          Message: (
            <MessageModal
              message="Thank you, please check your email."
              buttonMessage="You're welcome"
            />
          ),
          Email: ""
        });
      }
    });
  };

  handleNameAndPasswordSubmit = event => {
    event.preventDefault();
    fetch("/api/createaccount", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: this.state.Name,
        password: this.state.Password,
        emailToken: this.state.EmailToken
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
          Message: (
            <MessageModal
              message="Thank you for creating account."
              buttonMessage="You're welcome"
            />
          ),
          Name: "",
          Password: ""
        });
      }
    });
  };

  componentDidMount() {
    console.log("Component Did Mount");
    console.log(this.props.location.state.EmailToken);
    this.setState({
      EmailToken: this.props.location.state.EmailToken
    });
  }

  render() {
    let emailForm = "";
    let nameAndPasswordForm = "";

    if (this.state.EmailToken === "") {
      emailForm = (
        <form onSubmit={this.handleSubmitEmail}>
          <input
            id="create-account-email-input"
            type="text"
            placeholder="Email"
            value={this.state.Email}
            onChange={this.handleEmailChange}
          />
          <input
            data-test="create-account-submit-button"
            type="submit"
            value="Submit"
            className="form-submit-button"
            disabled={this.submitEmailIsDisabled()}
          />
        </form>
      );
    } else {
      nameAndPasswordForm = (
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
      );
    }

    return (
      <div>
        <Link to={"/"}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>
        <div className="user-pages-body-wrapper">
          <h1>Create Account</h1>

          {emailForm}
          {nameAndPasswordForm}

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
