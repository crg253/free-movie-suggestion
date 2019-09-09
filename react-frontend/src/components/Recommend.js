import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";

import MessageModal from "./MessageModal";

import "./UserForm.css";

class Recommend extends Component {
  //UserMovies should be in global state
  state = {
    SearchValue: "",
    SearchResultOptions: [],
    Message: ""
  };

  handleSearchValueChange = event => {
    this.setState({
      SearchValue: event.target.value,
      SearchResultOptions: [],
      Message: ""
    });
  };

  handleSearchSubmit = event => {
    event.preventDefault();
    fetch(
      "http://www.omdbapi.com/?s=" +
        this.state.SearchValue.trim() +
        "&apikey=e0bc91cd"
    )
      .then(res => res.json())
      .then(res => {
        if (res.Search !== undefined) {
          this.setState({SearchResultOptions: res.Search});
        }
      });
  };

  handleSuggestMovie = (title, year) => {
    fetch("/api/suggestmovie", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({title: title, year: year})
    }).then(res => {
      if (res.status === 500) {
        this.setState({
          SearchValue: "",
          SearchResultOptions: [],
          Message: (
            <MessageModal
              message="Sorry, movie already selected."
              buttonMessage="Fine be that way"
            />
          )
        });
      } else if (res.status === 401) {
        this.props.handleSetUserAndMovies(localStorage.getItem("token"));
        this.props.setRedirectBack("");
        this.props.setRedirectBackSlug("recommend");
        this.props.setRedirect(<Redirect to="/signin" />);
      } else if (res.status === 200) {
        this.props.handleSetUserAndMovies(localStorage.getItem("token"));
        this.setState({
          SearchValue: "",
          SearchResultOptions: [],
          Message: (
            <MessageModal
              message="Thank you for suggesting!"
              buttonMessage="You're welcome"
            />
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
          <h1>Hi {this.props.user.name} !</h1>
          <form onSubmit={this.handleSearchSubmit}>
            <label data-test="recommend-title">
              Search the OMDb to find a movie to suggest.
              <input
                data-test="recommend-movie-title-search-input"
                style={{marginTop: "20px"}}
                type="text"
                value={this.state.SearchValue}
                onChange={this.handleSearchValueChange}
              />
            </label>
            <input
              data-test="recommend-submit-search-button"
              className="form-submit-button"
              type="submit"
              value="Search"
            />
          </form>

          {this.state.SearchResultOptions.map((mov, index) => (
            <div key={"recommend-search-result-" + index}>
              <p>
                {mov.Title} {mov.Year}
              </p>
              <button
                data-test={"recommend-search-result-add-button-" + index}
                onClick={() => this.handleSuggestMovie(mov.Title, mov.Year)}
              >
                Add
              </button>
            </div>
          ))}
        </div>
        <div data-test="recommend-message-modal">{this.state.Message}</div>
        <div className="form-footer" />
      </div>
    );
  }
}

export default Recommend;
