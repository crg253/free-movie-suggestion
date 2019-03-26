import React from 'react';

import AppContext from "./AppContext";


const genres = () => {
  return(
      <div>
      <div style={{display:"flex"}}>

        <AppContext.Consumer>
          {(context) =>  context.Genres.map(genre=>(
            <div key={genre} style={{marginRight:'10px'}}>
              <p>{genre}</p>
                <button onClick={()=>context.chooseGenre(genre)}></button>
            </div>
          ))}
        </AppContext.Consumer>
      </div>

      <div style={{display:"flex"}}>
        <AppContext.Consumer>
            {(context) => context && (
              <div>
                <p>Saved</p>
                <button onClick={()=>context.chooseSaved()}></button>
              </div>
            )}
        </AppContext.Consumer>

        <AppContext.Consumer>
            {(context) => context && (
              <div style={{marginLeft:"10px"}}>
                <p>All Movies</p>
                <button onClick={()=>context.chooseAll()}></button>
              </div>
            )}
        </AppContext.Consumer>
      </div>
      </div>
  );
};

export default genres;
