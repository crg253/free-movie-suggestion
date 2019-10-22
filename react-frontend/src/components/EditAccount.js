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

  isDisabled = () => {
    return (
      this.state.NewPassword.length > 0 && this.state.NewPassword.length < 6
    );
  };

  handleUpdateAccount = event => {
    event.preventDefault();
    fetch("/api/editaccount", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        newName: this.state.NewName,
        newEmail: this.state.NewEmail,
        newPassword: this.state.NewPassword
      })
    }).then(res => {
      this.props.handleGetAndSetUserAndMovies(localStorage.getItem("token"));
      if (res.status === 401) {
        this.props.setRedirectBack("");
        this.props.setRedirectBackSlug("editaccount");
        this.props.setRedirect(<Redirect to="/signin" />);
      } else if (res.status === 200) {
        this.setState({
          NewName: "",
          NewEmail: "",
          NewPassword: "",
          Message: (
            <MessageModal message="Account updated." buttonMessage="Ok, good" />
          )
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
              data-test="edit-account-form"
              onSubmit={this.handleUpdateAccount}
              style={{textAlign: "center"}}
            >
              <input
                data-test="edit-account-username-input"
                type="text"
                placeholder={this.props.user.name}
                value={this.state.NewName}
                onChange={this.handleNewNameChange}
              />
              <input
                data-test="edit-account-email-input"
                type="text"
                placeholder={this.props.user.email}
                value={this.state.NewEmail}
                onChange={this.handleNewEmailChange}
              />
              <input
                data-test="edit-account-password-input"
                placeholder="Password"
                type="password"
                value={this.state.NewPassword}
                onChange={this.handleNewPasswordChange}
              />
              <input
                data-test="edit-account-submit-button"
                type="submit"
                value="Update"
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

export default EditAccount;
