import React, {Component} from "react";
import {Redirect} from "react-router-dom";

class ConfirmEmail extends Component {
  render() {
    let emailtoken = this.props.match.params.emailtoken;
    return (
      <div>
        <Redirect to={"/" + this.props.redirectBackSlug} />

        <Redirect
          to={{
            pathname: "/createaccount",
            state: {EmailToken: emailtoken}
          }}
        />
      </div>
    );
  }
}

export default ConfirmEmail;
