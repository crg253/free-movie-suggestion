import React from 'react';

import AppContext from "./AppContext";


const genres = () => {
  return(

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
  );
};

export default genres;
