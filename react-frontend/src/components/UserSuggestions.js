import React, { Component } from 'react';
import { Link } from "react-router-dom";

class UserSuggestions extends Component {

  render() {

    function dropThe(slug) {
      if (slug.slice(0,3)==="the"){
        return slug.slice(3,)
      }else{
        return slug
      }
    }

    function compareSlug(a,b) {
    if (dropThe(a.slug) < dropThe(b.slug))
      return -1;
    if (dropThe(a.slug) > dropThe(b.slug))
      return 1;
    return 0;
    }

    let allUserSuggestionsTrailers = this.props.movies
                    .filter(movie=>movie.username!=='crg253')
                    .filter(film=>film.video != null)
    allUserSuggestionsTrailers.sort(compareSlug)

    let allUserSuggestionsNoTrailers = this.props.movies
                    .filter(movie=>movie.username!=='crg253')
                    .filter(film=>film.video === null)
    allUserSuggestionsNoTrailers.sort(compareSlug)

    return (
      <div>
        <Link to={'/'}>
          <h1 id="main-title">FREE MOVIE SUGGESTION</h1>
        </Link>

        <div style={{
                display:'flex',
                flexWrap:'wrap',
                margin:'40px 2.5vw 0 2.5vw'}}>

                {allUserSuggestionsTrailers.map(film=>
                  <div key={'usersuggestion'+film.slug}>
                      <iframe
                          style={{
                            border:'0',
                            width:'26.6vw',
                            height:'14.94vw',
                            margin:'0 2.5vw 0 2.5vw'
                          }}
                          title={film.name}
                          src={film.video}
                          allowFullScreen></iframe>

                      <div style={{
                                  display:'flex',
                                  alignItems:'center',
                                  justifyContent:'center'}}>
                      <p>{film.name}</p>
                      <p style={{margin:'0 0 0 10px'}}>{film.year}</p>
                      </div>
                      <p style={{textAlign:'center'}}>suggested by {film.username}</p>
                      <div style={{textAlign:'center', margin:'0 0 5px 0'}}>
                      <button>save</button>
                      </div>
                  </div>
                  )}

            {allUserSuggestionsNoTrailers.map(film=>
              <div key={'usersuggestion'+film.slug}>
                  <div
                      style={{
                        width:'26.6vw',
                        height:'14.94vw',
                        margin:'0 2.5vw 0 2.5vw',
                        backgroundColor:'grey',
                        textAlign:'center'
                      }}
                    ><p style={{padding:'3vw 0 0 0'}}>Coming</p> <p>Soon</p></div>

                  <div style={{
                              display:'flex',
                              alignItems:'center',
                              justifyContent:'center'}}>
                  <p>{film.name}</p>
                  <p style={{margin:'0 0 0 10px'}}>{film.year}</p>
                  </div>
                  <p style={{textAlign:'center'}}>suggested by {film.username}</p>

                  <div style={{textAlign:'center', margin:'0 0 5px 0'}}>
                  <button>save</button>
                  </div>
              </div>
              )}
        </div>

      </div>
    );
  }
}

export default UserSuggestions;
