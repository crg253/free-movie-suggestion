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
    this.props.setUser("");
    this.props.setEmail("");
    this.props.handleGetMovies("");
    this.props.setRedirect(<Redirect to={"/"} />);
  };

  render() {
    let currentUserLink = "";
    if (this.props.user.length > 0) {
      currentUserLink = (
        <div onClick={() => this.changeMenuDisplay()}>
          <Link to={"/usermovies"}>
            <h2 className="menu-links">{this.props.user + "'s Movies"}</h2>
          </Link>
        </div>
      );
    }

    let signInLink = "";
    if (this.props.user.length === 0) {
      signInLink = (
        <div onClick={() => this.changeMenuDisplay()}>
          <Link to={"/signin"}>
            <h2 className="menu-links">Sign In</h2>
          </Link>
        </div>
      );
    }

    let editAccountLink = "";
    if (this.props.user.length > 0) {
      editAccountLink = (
        <div onClick={() => this.changeMenuDisplay()}>
          <Link to={"/editaccount"}>
            <p className="dim-menu-links">edit account</p>
          </Link>
        </div>
      );
    }

    let deleteAccountLink = "";
    if (this.props.user.length > 0) {
      deleteAccountLink = (
        <div onClick={() => this.changeMenuDisplay()}>
          <Link to={"/deleteaccount"}>
            <p className="dim-menu-links">delete account</p>
          </Link>
        </div>
      );
    }

    let signOutLink = "";
    if (this.props.user.length > 0) {
      signOutLink = (
        <button
          className="button-nostyle"
          onClick={() => {
            this.handleSignOut();
            this.changeMenuDisplay();
          }}
        >
          <p className="dim-menu-links">sign out</p>
        </button>
      );
    }

    return (
      <div>
        <button
          id="menu-button"
          className="button-nostyle"
          style={{display: this.state.displayButton}}
          onClick={() => this.changeMenuDisplay()}
        />

        <div id="open-menu" style={{display: this.state.displayMenu}}>
          <button
            id="close-menu-button"
            className="button-nostyle"
            onClick={() => this.changeMenuDisplay()}
          >
            X
          </button>

          <div id="menu-links-wrapper">
            {signInLink}
            {currentUserLink}

            <div onClick={() => this.changeMenuDisplay()}>
              <Link to={"/recommend"}>
                <h2 className="menu-links">Recommend</h2>
              </Link>
            </div>

            <div onClick={() => this.changeMenuDisplay()}>
              <Link to={"/usersuggestions"}>
                <h2 className="menu-links">User Suggestions</h2>
              </Link>
            </div>

            <div onClick={() => this.changeMenuDisplay()}>
              <Link to={"/about"}>
                <h2 className="menu-links">About/Contact</h2>
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
