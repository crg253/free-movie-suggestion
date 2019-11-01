import React, {Component} from "react";
import {Link} from "react-router-dom";

import MessageModal from "./MessageModal";

import "./UserForm.css";

class DeleteAccount extends Component {
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

  handleDeleteAccount = event => {
    let headers = new Headers();
    headers.set(
      "Authorization",
      "Basic " +
        Buffer.from(this.state.Name + ":" + this.state.Password).toString(
          "base64"
        )
    );
    event.preventDefault();
    fetch("/api/deleteaccount", {
      method: "DELETE",
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
        this.props.handleGetAndSetUserAndMovies(localStorage.getItem("token"));
        this.setState({
          Name: "",
          Email: "",
          Password: "",
          Message: (
            <MessageModal message="Account deleted." buttonMessage="OK" />
          )
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
          <h1>Delete Account</h1>

          <div>
            <form onSubmit={this.handleDeleteAccount}>
              <input
                data-test="delete-account-username-input"
                type="text"
                placeholder="Name"
                value={this.state.Name}
                onChange={this.handleNameChange}
              />
              <input
                data-test="delete-account-password-input"
                placeholder="Password"
                type="password"
                value={this.state.Password}
                onChange={this.handlePasswordChange}
              />
              <input
                data-test="delete-account-submit-button"
                type="submit"
                value="Delete"
                style={{backgroundColor: "#B22222"}}
                className="form-submit-button"
                disabled={this.isDisabled()}
              />
            </form>
          </div>
        </div>
        {this.state.Message}
        <div className="form-footer" />
      </div>
    );
  }
}

export default DeleteAccount;
