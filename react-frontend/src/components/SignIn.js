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
      if (res.status === 400 || res.status === 401 || res.status === 500) {
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
              Password: ""
            });
            this.props.setRedirectBack(
              <Redirect
                to={{
                  pathname: "/",
                  state: {
                    message: "Now signed in as " + res.name + ".",
                    buttonMessage: "Awesome"
                  }
                }}
              />
            );
          }
        });
      }
    });
  };

  componentDidMount() {
    this.props.setRedirect("");
    if (this.props.location.state !== undefined) {
      this.setState({
        Message: (
          <MessageModal
            message={this.props.location.state.message}
            buttonMessage={this.props.location.state.buttonMessage}
          />
        )
      });
    }
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

          <div>
            <Link to={"/resetpassword"}>
              <h1>forgot password?</h1>
            </Link>

            <Link to={"/createaccount"}>
              <h1>
                /create
                <span>account</span>
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
