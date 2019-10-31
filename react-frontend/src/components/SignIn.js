import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";

import MessageModal from "./MessageModal";

import "./UserForm.css";
import "./SignIn.css";

class SignIn extends Component {
  state = {
    Name: "",
    Password: "",
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

  isDisabled = () => {
    return this.state.Name.length === 0 || this.state.Password.length < 6;
  };

  handleSignInSubmit = event => {
    let headers = new Headers();
    headers.set(
      "Authorization",
      "Basic " +
        Buffer.from(this.state.Name + ":" + this.state.Password).toString(
          "base64"
        )
    );
    event.preventDefault();
    fetch("/api/signin", {
      method: "POST",
      headers: headers
    }).then(res => {
      if (res.status === 401) {
        this.setState({
          Name: "",
          Password: "",
          Message: (
            <MessageModal
              message="Incorrect username or password."
              buttonMessage="Fine be that way"
            />
          )
        });
      } else if (res.status === 200) {
        res.json().then(res => {
          localStorage.setItem("token", res.token);
          this.props.handleGetAndSetUserAndMovies(res.token);

          // redirect and modal decision
          if (this.props.redirectBackGenre.length > 0) {
            this.props.setRedirectBack(
              <Redirect
                to={
                  "/" +
                  this.props.redirectBackGenre +
                  "/" +
                  this.props.redirectBackSlug
                }
              />
            );
            this.props.setRedirectBackSlug("");
            this.props.setRedirectBackGenre("");
          } else if (this.props.redirectBackSlug.length > 0) {
            this.props.setRedirectBack(
              <Redirect to={"/" + this.props.redirectBackSlug} />
            );
            this.props.setRedirectBackSlug("");
          } else {
            this.setState({
              Name: "",
              Password: "",
              Message: (
                <MessageModal
                  message={"Now signed in as " + res.name + "."}
                  buttonMessage="Awesome"
                />
              )
            });
          }
        });
      }
    });
  };

  componentDidMount() {
    this.props.setRedirect("");
  }

  componentWillUnmount() {
    this.props.setRedirectBack("");
  }

  render() {
    return (
      <div>
        {this.props.redirectBack}
        <Link to={"/"}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>
        <div className="user-pages-body-wrapper">
          <h1 data-test="signin-title">Sign In</h1>
          <form onSubmit={this.handleSignInSubmit}>
            <input
              data-test="signin-username-input"
              type="text"
              placeholder="Name"
              value={this.state.Name}
              onChange={this.handleNameChange}
            />

            <input
              data-test="signin-password-input"
              placeholder="Password"
              type="password"
              value={this.state.Password}
              onChange={this.handlePasswordChange}
            />

            <input
              data-test="signin-submit-button"
              type="submit"
              value="Submit"
              className="form-submit-button"
              disabled={this.isDisabled()}
            />
          </form>

          <div id="forgotpassword-createaccount-links">
            <Link to={"/resetpassword"}>
              <h1 id="resetpassword-link">forgot password?</h1>
            </Link>

            <Link data-test="signin-create-account-link" to={"/createaccount"}>
              <h1 id="createaccount-link">
                /create
                <span id="account-word-style">account</span>
              </h1>
            </Link>
          </div>
        </div>
        {/*class="user-pages-body-wrapper"*/}
        <div data-test="signin-message-modal">{this.state.Message}</div>
        <div className="form-footer" />
      </div>
    );
  }
}

export default SignIn;
