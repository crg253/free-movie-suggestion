import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";

import MessageModal from "./MessageModal";

import "./UserForm.css";

class EditAccount extends Component {
  state = {
    NewName: "",
    NewEmail: "",
    NewPassword: "",
    Message: ""
  };

  handleNewNameChange = event => {
    this.setState({
      NewName: event.target.value,
      Message: ""
    });
  };
  handleNewEmailChange = event => {
    this.setState({
      NewEmail: event.target.value,
      Message: ""
    });
  };
  handleNewPasswordChange = event => {
    this.setState({
      NewPassword: event.target.value,
      Message: ""
    });
  };

  handleUpdateAccount = event => {
    event.preventDefault();
    fetch("/api/updateaccount", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        newUserName: this.state.NewName,
        newEmail: this.state.NewEmail,
        newPassword: this.state.NewPassword
      })
    }).then(res => {
      if (res.status === 401) {
        this.props.setUser("");
        this.props.setEmail("");
        this.props.handleGetMovies("");
        this.props.setRedirectBack("");
        this.props.setRedirectBackSlug("editaccount");
        this.props.setRedirect(<Redirect to="/signin" />);
      } else if (res.status === 200) {
        res.json().then(res => {
          this.props.setUser(res.user);
          this.props.setEmail(res.email);
          this.props.handleGetMovies(res.user);
          this.setState({
            NewName: "",
            NewEmail: "",
            NewPassword: "",
            Message: (
              <MessageModal
                message="Account updated."
                buttonMessage="Ok, good"
              />
            )
          });
        });
      }
    });
  };

  render() {
    return (
      <div>
        {this.props.redirect}

        <Link to={"/"}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>

        <div className="user-pages-body-wrapper">
          <h1>Edit Account</h1>
          <div>
            <form
              onSubmit={this.handleUpdateAccount}
              style={{textAlign: "center"}}
            >
              <input
                type="text"
                placeholder={this.props.user.name}
                value={this.state.NewName}
                onChange={this.handleNewNameChange}
              />
              <input
                type="text"
                placeholder={this.props.email}
                value={this.state.NewEmail}
                onChange={this.handleNewEmailChange}
              />
              <input
                type="text"
                placeholder="New Password"
                type="password"
                value={this.state.NewPassword}
                onChange={this.handleNewPasswordChange}
              />
              <input
                type="submit"
                value="Update"
                className="form-submit-button"
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

export default EditAccount;
