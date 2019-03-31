import React from "react";
import { Link } from "react-router-dom";

import NavBar from './NavBar';


const HomePage = (props) => {

  let randomMovies = {
      Action:'Action',Comedy:'Comedy',Documentary:'',Drama:'',Horror:'',"Mystery & Suspense":'',Romance:'',"Sci-Fi":''};
  if(props.movies.length>0){
      for(let i in props.genres){
      const genreMovies = [...props.movies].filter(movie =>movie.tags.includes(props.genres[i]));
      const randomMovie = genreMovies[Math.floor(Math.random() * genreMovies.length)];
      randomMovies[props.genres[i]]=randomMovie;
      }
  }

  return(
      <div>
        <NavBar/>
        {props.genres.map(genre=>
          <div
            style={{textAlign:"center"}}
            onClick={()=>props.chooseGenre(genre)}>
            <h2 style={{lineHeight:"0.8"}}>
              <Link to={'/' + randomMovies[genre].slug}>{genre}</Link>
            </h2>
          </div>
        )}
      </div>
  );
};

export default HomePage;
