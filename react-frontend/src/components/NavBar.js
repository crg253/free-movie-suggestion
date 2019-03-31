import React from 'react';
import { Link } from "react-router-dom";

const navBar = (props) => {
  return(
    <div style={{border:"1px solid red"}}>
      <div style={{float:"right"}}>
      <Link to={'/'}>
        <p style= {{border:"1px solid blue", display:"inline"}} >Home</p>
      </Link>

      <Link to={'/list'}>
        <p style= {{border:"1px solid blue", display:"inline"}} >List</p>
      </Link>

        <p style= {{border:"1px solid purple",display:"inline"}}>About</p>
      </div>
    </div>
  );
};

export default navBar;
