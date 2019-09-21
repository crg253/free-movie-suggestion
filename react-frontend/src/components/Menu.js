import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";

import "./Menu.css";

class Menu extends Component {
  state = {
    displayButton: "inline",
    displayMenu: "none"
  };

  changeMenuDisplay = () => {
    if (this.state.displayButton === "inline") {
      this.setState({displayButton: "none"});
      this.setState({displayMenu: "inline"});
    } else {
      this.setState({displayButton: "inline"});
      this.setState({displayMenu: "none"});
    }
  };

  handleSignOut = () => {
    localStorage.removeItem("token");
    this.props.handleGetAndSetUserAndMovies(localStorage.getItem("token"));
  };

  render() {
    let currentUserLink = "";
    if (this.props.user.name.length > 0) {
      currentUserLink = (
        <div
          data-test="menu-usermovies-link"
          onClick={() => this.changeMenuDisplay()}
        >
          <Link to={"/usermovies"}>
            <h2 className="menu-links">{this.props.user.name + "'s Movies"}</h2>
          </Link>
        </div>
      );
    }

    let signInLink = "";
    if (this.props.user.name.length === 0) {
      signInLink = (
        <div
          data-test="menu-signin-link"
          onClick={() => this.changeMenuDisplay()}
        >
          <Link to={"/signin"}>
            <h2 className="menu-links">Sign In</h2>
          </Link>
        </div>
      );
    }

    let editAccountLink = "";
    if (this.props.user.name.length > 0) {
      editAccountLink = (
        <div
          data-test="menu-edit-account-link"
          onClick={() => this.changeMenuDisplay()}
        >
          <Link to={"/editaccount"}>
            <p className="dim-menu-links">edit account</p>
          </Link>
        </div>
      );
    }

    let deleteAccountLink = "";
    if (this.props.user.name.length > 0) {
      deleteAccountLink = (
        <div
          data-test="menu-delete-account-link"
          onClick={() => this.changeMenuDisplay()}
        >
          <Link to={"/deleteaccount"}>
            <p className="dim-menu-links">delete account</p>
          </Link>
        </div>
      );
    }

    let signOutLink = "";
    if (this.props.user.name.length > 0) {
      signOutLink = (
        <div
          data-test="menu-signout-link"
          onClick={() => {
            this.handleSignOut();
            this.changeMenuDisplay();
          }}
        >
          <Link to={"/"}>
            <p className="dim-menu-links">sign out</p>
          </Link>
        </div>
      );
    }

    return (
      <div data-test="menu-wrapper">
        <button
          data-test="open-menu-button"
          id="menu-button"
          className="button-nostyle"
          style={{display: this.state.displayButton}}
          onClick={() => this.changeMenuDisplay()}
        />

        <div id="open-menu" style={{display: this.state.displayMenu}}>
          <button
            data-test="close-menu-button"
            id="close-menu-button"
            className="button-nostyle"
            onClick={() => this.changeMenuDisplay()}
          >
            X
          </button>

          <div id="menu-links-wrapper">
            {signInLink}
            {currentUserLink}

            <div
              data-test="menu-recommend-link"
              onClick={() => this.changeMenuDisplay()}
            >
              <Link to={"/recommend"}>
                <h2 className="menu-links">Recommend</h2>
              </Link>
            </div>

            <div
              data-test="menu-usersuggestions-link"
              onClick={() => this.changeMenuDisplay()}
            >
              <Link to={"/usersuggestions"}>
                <h2 className="menu-links">User Suggestions</h2>
              </Link>
            </div>

            <div onClick={() => this.changeMenuDisplay()}>
              <Link to={"/about"}>
                <h2 className="menu-links">About</h2>
              </Link>
            </div>

            <div onClick={() => this.changeMenuDisplay()}>
              <Link to={"/contact"}>
                <h2 className="menu-links">Contact</h2>
              </Link>
            </div>

            {editAccountLink}
            {deleteAccountLink}
            {signOutLink}
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
