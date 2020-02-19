import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import RoutingComponent from "./components/RoutingComponent";
import "./App.css";

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
      .replace(/[" "]/g, "")
      .toLowerCase();
    return title;
  };

  yearPlusDropTheAndPunct = (year, title) => {
    if (title.slice(0, 4) === "The ") {
      title = title.slice(4);
    }
    title = title
      .replace(/['.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .replace(/[" "]/g, "")
      .toLowerCase();
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
      this.handleGetAndSetUserAndMovies(localStorage.getItem("token"));
      if (res.status === 401) {
        this.setState({
          RedirectBack: "",
          RedirectBackGenre: redirectBackGenre,
          RedirectBackSlug: redirectBackSlug,
          Redirect: <Redirect to="/signin" />
        });
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

  handleGetAndSetUser = token => {
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

  handleGetAndSetMovies = token => {
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

  handleGetAndSetUserAndMovies = token => {
    if (token === null) {
      token = "";
    }
    this.handleGetAndSetUser(token);
    this.handleGetAndSetMovies(token);
  };

  componentDidMount() {
    this.handleGetAndSetUserAndMovies(localStorage.getItem("token"));
  }

  render() {
    return (
      <RoutingComponent
        movies={this.state.Movies}
        redirect={this.state.Redirect}
        redirectBack={this.state.RedirectBack}
        redirectBackGenre={this.state.RedirectBackGenre}
        redirectBackSlug={this.state.RedirectBackSlug}
        selectedGenre={this.state.SelectedGenre}
        scrollGenres={this.state.ScrollGenres}
        user={this.state.User}
        addGenreIndex={this.addGenreIndex}
        changeGenreCase={this.changeGenreCase}
        compareTitle={this.compareTitle}
        compareYear={this.compareYear}
        getRandomMovies={this.getRandomMovies}
        handleSaveUnsave={this.handleSaveUnsave}
        handleGetAndSetUserAndMovies={this.handleGetAndSetUserAndMovies}
        indexDown={this.state.IndexDown}
        indexUp={this.state.IndexUp}
        redirect={this.state.Redirect}
        setIndexes={this.setIndexes}
        setRedirect={this.setRedirect}
        setRedirectBack={this.setRedirectBack}
        setRedirectBackGenre={this.setRedirectBackGenre}
        setRedirectBackSlug={this.setRedirectBackSlug}
        setSelectedGenre={this.setSelectedGenre}
        setSort={this.setSort}
        sortBy={this.state.SortBy}
        subtractGenreIndex={this.subtractGenreIndex}
      />
    );
  }
}

export default App;
