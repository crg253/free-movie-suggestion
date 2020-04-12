import React, {Component} from "react";
import {Link} from "react-router-dom";

import MessageModal from "./MessageModal";

import "./UserForm.css";
import "./FormLinks.css";

class CreateAccount extends Component {
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
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  submitEmailIsDisabled = () => {
    return (
      this.state.Email.length === 0 || !this.validateEmail(this.state.Email)
    );
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

  render() {
    return (
      <div>
        <Link to={"/"}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>
        <div className="user-pages-body-wrapper">
          <h1>Create Account</h1>

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

          <div id="two-links">
            <Link to={"/resetpassword"}>
              <h1 id="first-link" style={{color: "#778899"}}>
                forgot password?
              </h1>
            </Link>

            <Link to={"/signin"}>
              <h1 id="second-link">
                /sign
                <span style={{color: "#a9a9a9"}}>in</span>
              </h1>
            </Link>
          </div>
        </div>
        {/* class="user-pages-body-wrapper"*/}
        <div data-test="create-account-message-modal">{this.state.Message}</div>
        <div className="form-footer" />
      </div>
    );
  }
}

export default CreateAccount;
