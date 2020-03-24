import React, {Component} from "react";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";

import HomePage from "./HomePage";
import TrailerPage from "./TrailerPage";
import SignIn from "./SignIn";
import CreateAccount from "./CreateAccount";
import Recommend from "./Recommend";
import Menu from "./Menu";
import UserMovies from "./UserMovies";
import UserSuggestions from "./UserSuggestions";
import ResetPassword from "./ResetPassword";
import EditAccount from "./EditAccount";
import DeleteAccount from "./DeleteAccount";
import About from "./About";
import Contact from "./Contact";
import CompleteRegistration from "./CompleteRegistration";
import CompleteResetPassword from "./CompleteResetPassword";

class RoutingComponent extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route
            path="/"
            render={props => (
              <Menu
                {...props}
                user={this.props.user}
                setRedirect={this.props.setRedirect}
                handleGetAndSetUserAndMovies={
                  this.props.handleGetAndSetUserAndMovies
                }
              />
            )}
          />

          <Switch>
            <Route path="/about" render={props => <About {...props} />} />

            <Route path="/contact" render={props => <Contact {...props} />} />

            <Route
              path="/completeregistration/:emailtoken"
              render={props => <CompleteRegistration {...props} />}
            />

            <Route
              path="/completeresetpassword/:emailtoken"
              render={props => <CompleteResetPassword {...props} />}
            />

            <Route
              path="/createaccount"
              render={props => <CreateAccount {...props} />}
            />

            <Route
              path="/deleteaccount"
              render={props => (
                <DeleteAccount
                  {...props}
                  redirect={this.props.redirect}
                  handleGetAndSetUserAndMovies={
                    this.props.handleGetAndSetUserAndMovies
                  }
                />
              )}
            />

            <Route
              path="/editaccount"
              render={props => (
                <EditAccount
                  {...props}
                  user={this.props.user}
                  redirect={this.props.redirect}
                  setRedirect={this.props.setRedirect}
                  setRedirectBack={this.props.setRedirectBack}
                  setRedirectBackSlug={this.props.setRedirectBackSlug}
                  handleGetAndSetUserAndMovies={
                    this.props.handleGetAndSetUserAndMovies
                  }
                />
              )}
            />

            <Route
              path="/recommend"
              render={props => (
                <Recommend
                  {...props}
                  user={this.props.user}
                  setRedirect={this.props.setRedirect}
                  redirect={this.props.redirect}
                  setRedirectBack={this.props.setRedirectBack}
                  setRedirectBackSlug={this.props.setRedirectBackSlug}
                  handleGetAndSetUserAndMovies={
                    this.props.handleGetAndSetUserAndMovies
                  }
                />
              )}
            />

            <Route
              path="/resetpassword"
              render={props => <ResetPassword {...props} />}
            />

            <Route
              path="/signin"
              render={props => (
                <SignIn
                  {...props}
                  user={this.props.user}
                  redirectBack={this.props.redirectBack}
                  handleGetAndSetUserAndMovies={
                    this.props.handleGetAndSetUserAndMovies
                  }
                  setRedirect={this.props.setRedirect}
                  setRedirectBack={this.props.setRedirectBack}
                  redirectBackSlug={this.props.redirectBackSlug}
                  setRedirectBackSlug={this.props.setRedirectBackSlug}
                  redirectBackGenre={this.props.redirectBackGenre}
                  setRedirectBackGenre={this.props.setRedirectBackGenre}
                />
              )}
            />

            <Route
              path="/usermovies"
              render={props => (
                <UserMovies
                  {...props}
                  user={this.props.user}
                  movies={this.props.movies}
                  handleSaveUnsave={this.props.handleSaveUnsave}
                  redirect={this.props.redirect}
                  compareTitle={this.props.compareTitle}
                  setRedirectBack={this.props.setRedirectBack}
                  setRedirectBackSlug={this.props.setRedirectBackSlug}
                  setRedirect={this.props.setRedirect}
                  handleGetAndSetUserAndMovies={
                    this.props.handleGetAndSetUserAndMovies
                  }
                />
              )}
            />

            <Route
              path="/usersuggestions"
              render={props => (
                <UserSuggestions
                  {...props}
                  redirect={this.props.redirect}
                  movies={this.props.movies}
                  handleSaveUnsave={this.props.handleSaveUnsave}
                  compareTitle={this.props.compareTitle}
                />
              )}
            />

            <Route
              path="/:genreslug/:movieslug"
              render={props => (
                <TrailerPage
                  {...props}
                  movies={this.props.movies}
                  changeGenreCase={this.props.changeGenreCase}
                  getRandomMovies={this.props.getRandomMovies}
                  sortBy={this.props.sortBy}
                  setSort={this.props.setSort}
                  scrollGenres={this.props.scrollGenres}
                  indexUp={this.props.indexUp}
                  indexDown={this.props.indexDown}
                  subtractGenreIndex={this.props.subtractGenreIndex}
                  addGenreIndex={this.props.addGenreIndex}
                  setIndexes={this.props.setIndexes}
                  redirect={this.props.redirect}
                  handleSaveUnsave={this.props.handleSaveUnsave}
                  compareTitle={this.props.compareTitle}
                  compareYear={this.props.compareYear}
                />
              )}
            />

            <Route
              path="/"
              render={props => (
                <HomePage
                  {...props}
                  setSelectedGenre={this.props.setSelectedGenre}
                  selectedGenre={this.props.selectedGenre}
                  getRandomMovies={this.props.getRandomMovies}
                  setRedirect={this.props.setRedirect}
                />
              )}
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default RoutingComponent;
