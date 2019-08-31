import React, {Component} from "react";
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";

import "./App.css";
import HomePage from "./components/HomePage";
import TrailerPage from "./components/TrailerPage";
import SignIn from "./components/SignIn";
import CreateAccount from "./components/CreateAccount";
import Recommend from "./components/Recommend";
import Menu from "./components/Menu";
import UserMovies from "./components/UserMovies";
import UserSuggestions from "./components/UserSuggestions";
import ResetPassword from "./components/ResetPassword";
import EditAccount from "./components/EditAccount";
import DeleteAccount from "./components/DeleteAccount";
import About from "./components/About";
import Contact from "./components/Contact";

class App extends Component {
  state = {
    Movies: [],
    SelectedGenre: "",
    SortBy: "name",
    User: {name: "", email: ""},
    Redirect: "",
    RedirectBackGenre: "",
    RedirectBackSlug: "",
    RedirectBack: "",
    ScrollGenres: [
      "All",
      "Action",
      "Comedy",
      "Documentary",
      "Drama",
      "Horror",
      "Mystery & Suspense",
      "Romance",
      "Sci-Fi & Fantasy"
    ],
    GenreIndex: "0",
    IndexUp: "0",
    IndexDown: "0"
  };

  setSelectedGenre = genre => {
    this.setState({SelectedGenre: genre});
  };
  setRedirectBackSlug = newSlug => {
    this.setState({RedirectBackSlug: newSlug});
  };
  setRedirectBackGenre = newGenre => {
    this.setState({RedirectBackGenre: newGenre});
  };
  setRedirectBack = newRedirectBack => {
    this.setState({RedirectBack: newRedirectBack});
  };
  setRedirect = newRedirect => {
    this.setState({Redirect: newRedirect});
  };
  setSort = sortParam => {
    this.setState({SortBy: sortParam});
  };
  setUser = newUser => {
    this.setState({User: newUser});
  };
  setEmail = newEmail => {
    this.setState({Email: newEmail});
  };
  setIndexes = (down, index, up) => {
    this.setState({IndexDown: down, GenreIndex: index, IndexUp: up});
  };

  //Sort Helper Functions
  dropTheAndPunct = title => {
    if (title.slice(0, 4) === "The ") {
      title = title.slice(4);
    }
    title = title
      .replace(/['.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .replace(/[" "]/g, "");
    return title;
  };

  yearPlusDropTheAndPunct = (year, title) => {
    if (title.slice(0, 4) === "The ") {
      title = title.slice(4);
    }
    title = title
      .replace(/['.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .replace(/[" "]/g, "");
    let yearAndSlug = year + title;
    return yearAndSlug;
  };

  compareTitle = (a, b) => {
    if (this.dropTheAndPunct(a.title) < this.dropTheAndPunct(b.title))
      return -1;
    if (this.dropTheAndPunct(a.title) > this.dropTheAndPunct(b.title)) return 1;
    return 0;
  };

  compareYear = (a, b) => {
    if (
      this.yearPlusDropTheAndPunct(a.year, a.title) <
      this.yearPlusDropTheAndPunct(b.year, b.title)
    )
      return -1;
    if (
      this.yearPlusDropTheAndPunct(a.year, a.title) >
      this.yearPlusDropTheAndPunct(b.year, b.title)
    )
      return 1;
    return 0;
  };

  handleSaveUnsave = (
    saveunsave,
    slug,
    redirectBackGenre,
    redirectBackSlug
  ) => {
    fetch("/api/".concat(saveunsave), {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({slug: slug})
    }).then(res => {
      if (res.status === 401) {
        this.setState({
          RedirectBack: "",
          RedirectBackGenre: redirectBackGenre,
          RedirectBackSlug: redirectBackSlug,
          Redirect: <Redirect to="/signin" />
        });
        this.handleGetUserAndMovies(localStorage.getItem("token"));
      } else if (res.status === 200) {
        this.handleGetUserAndMovies(localStorage.getItem("token"));
      }
    });
  };

  changeGenreCase = (toUpperOrLower, genreName) => {
    if (toUpperOrLower === "toLower") {
      if (genreName === "Mystery & Suspense") {
        return "mysteryandsuspense";
      } else if (genreName === "Sci-Fi & Fantasy") {
        return "scifiandfantasy";
      } else {
        return genreName.toLowerCase();
      }
    } else if (toUpperOrLower === "toUpper") {
      if (genreName === "mysteryandsuspense") {
        return "Mystery & Suspense";
      } else if (genreName === "scifiandfantasy") {
        return "Sci-Fi & Fantasy";
      } else {
        let upperGenreName = genreName[0].toUpperCase();
        upperGenreName = upperGenreName.concat(genreName.slice(1));
        return upperGenreName;
      }
    }
  };

  subtractGenreIndex = () => {
    if (this.state.GenreIndex === 0) {
      this.setState({
        IndexUp: this.state.GenreIndex,
        GenreIndex: 8,
        IndexDown: this.state.IndexDown - 1
      });
    } else if (this.state.GenreIndex === 1) {
      this.setState({
        IndexUp: this.state.GenreIndex,
        GenreIndex: this.state.GenreIndex - 1,
        IndexDown: 8
      });
    } else {
      this.setState({
        IndexUp: this.state.GenreIndex,
        GenreIndex: this.state.GenreIndex - 1,
        IndexDown: this.state.IndexDown - 1
      });
    }
  };

  addGenreIndex = () => {
    if (this.state.GenreIndex === 8) {
      this.setState({
        IndexDown: this.state.GenreIndex,
        GenreIndex: 0,
        IndexUp: this.state.IndexUp + 1
      });
    } else if (this.state.GenreIndex === 7) {
      this.setState({
        IndexDown: this.state.GenreIndex,
        GenreIndex: this.state.GenreIndex + 1,
        IndexUp: 0
      });
    } else {
      this.setState({
        IndexDown: this.state.GenreIndex,
        GenreIndex: this.state.GenreIndex + 1,
        IndexUp: this.state.IndexUp + 1
      });
    }
  };

  getRandomMovies = () => {
    let approvedMovies = this.state.Movies.filter(
      movie => movie.recommendedBy === "crg253"
    );
    let randomMovies = {
      Action: "",
      Comedy: "",
      Documentary: "",
      Drama: "",
      Horror: "",
      "Mystery & Suspense": "",
      Romance: "",
      "Sci-Fi & Fantasy": ""
    };
    if (approvedMovies.length > 0) {
      for (let gen in randomMovies) {
        const genreMovies = [...approvedMovies].filter(approvedMovie =>
          approvedMovie.tags.includes(gen)
        );

        const randomNum = Math.floor(Math.random() * genreMovies.length);
        const randomMovie = genreMovies[randomNum];
        randomMovies[gen] = randomMovie;
      }
    }
    let comingSoon = [...this.state.Movies].filter(
      movie => movie.slug === "comingsoon"
    )[0];

    randomMovies["All"] = comingSoon;
    return randomMovies;
  };

  handleGetUser = token => {
    fetch("/api/getuser", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({token: token})
    }).then(res => {
      res.json().then(res => {
        this.setState({User: res.user});
      });
    });
  };

  handleGetMovies = token => {
    fetch("/api/getmovies", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({token: token})
    }).then(res => {
      res.json().then(res => {
        this.setState({Movies: res.movies});
      });
    });
  };

  handleGetUserAndMovies = token => {
    if (token === null) {
      token = "";
    }
    this.handleGetUser(token);
    this.handleGetMovies(token);
  };

  componentDidMount() {
    this.handleGetUserAndMovies(localStorage.getItem("token"));
  }

  render() {
    console.log(this.state.Movies);
    return (
      <BrowserRouter>
        <div>
          <Route
            path="/"
            render={props => (
              <Menu
                {...props}
                user={this.state.User}
                setRedirect={this.setRedirect}
                handleGetUserAndMovies={this.handleGetUserAndMovies}
              />
            )}
          />

          <Switch>
            <Route path="/about" render={props => <About {...props} />} />

            <Route path="/contact" render={props => <Contact {...props} />} />

            <Route
              path="/createaccount"
              render={props => <CreateAccount {...props} />}
            />

            <Route
              path="/deleteaccount"
              render={props => (
                <DeleteAccount
                  {...props}
                  setUser={this.setUser}
                  setEmail={this.setEmail}
                  redirect={this.state.Redirect}
                  handleGetMovies={this.handleGetMovies}
                />
              )}
            />

            <Route
              path="/editaccount"
              render={props => (
                <EditAccount
                  {...props}
                  user={this.state.User}
                  redirect={this.state.Redirect}
                  setRedirect={this.setRedirect}
                  setRedirectBack={this.setRedirectBack}
                  setRedirectBackSlug={this.setRedirectBackSlug}
                  handleGetUserAndMovies={this.handleGetUserAndMovies}
                />
              )}
            />

            <Route
              path="/recommend"
              render={props => (
                <Recommend
                  {...props}
                  user={this.state.User}
                  setRedirect={this.setRedirect}
                  redirect={this.state.Redirect}
                  setRedirectBack={this.setRedirectBack}
                  setRedirectBackSlug={this.setRedirectBackSlug}
                  handleGetUserAndMovies={this.handleGetUserAndMovies}
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
                  user={this.state.User}
                  redirectBack={this.state.RedirectBack}
                  setUser={this.setUser}
                  setEmail={this.setEmail}
                  handleGetUserAndMovies={this.handleGetUserAndMovies}
                  setRedirect={this.setRedirect}
                  setRedirectBack={this.setRedirectBack}
                  redirectBackSlug={this.state.RedirectBackSlug}
                  setRedirectBackSlug={this.setRedirectBackSlug}
                  redirectBackGenre={this.state.RedirectBackGenre}
                  setRedirectBackGenre={this.setRedirectBackGenre}
                />
              )}
            />

            <Route
              path="/usermovies"
              render={props => (
                <UserMovies
                  {...props}
                  user={this.state.User}
                  movies={this.state.Movies}
                  handleSaveUnsave={this.handleSaveUnsave}
                  redirect={this.state.Redirect}
                  compareTitle={this.compareTitle}
                  setRedirectBack={this.setRedirectBack}
                  setRedirectBackSlug={this.setRedirectBackSlug}
                  setRedirect={this.setRedirect}
                  handleGetUserAndMovies={this.handleGetUserAndMovies}
                />
              )}
            />

            <Route
              path="/usersuggestions"
              render={props => (
                <UserSuggestions
                  {...props}
                  redirect={this.state.Redirect}
                  movies={this.state.Movies}
                  handleSaveUnsave={this.handleSaveUnsave}
                  compareTitle={this.compareTitle}
                />
              )}
            />

            <Route
              path="/:genreslug/:movieslug"
              render={props => (
                <TrailerPage
                  {...props}
                  movies={this.state.Movies}
                  changeGenreCase={this.changeGenreCase}
                  getRandomMovies={this.getRandomMovies}
                  sortBy={this.state.SortBy}
                  setSort={this.setSort}
                  scrollGenres={this.state.ScrollGenres}
                  indexUp={this.state.IndexUp}
                  indexDown={this.state.IndexDown}
                  subtractGenreIndex={this.subtractGenreIndex}
                  addGenreIndex={this.addGenreIndex}
                  setIndexes={this.setIndexes}
                  redirect={this.state.Redirect}
                  handleSaveUnsave={this.handleSaveUnsave}
                  compareTitle={this.compareTitle}
                  compareYear={this.compareYear}
                />
              )}
            />

            <Route
              path="/"
              render={props => (
                <HomePage
                  {...props}
                  setSelectedGenre={this.setSelectedGenre}
                  selectedGenre={this.state.SelectedGenre}
                  getRandomMovies={this.getRandomMovies}
                  setRedirect={this.setRedirect}
                />
              )}
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
