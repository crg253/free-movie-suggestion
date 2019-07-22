import React, {Component} from "react";

import "./MessageModal.css";

class MessageModal extends Component {
  state = {
    Display: "inline"
  };
  updateModalDisplay = () => {
    this.setState({Display: "none"});
  };

  render() {
    return (
      <div style={{display: this.state.Display}} id="message-modal-wrapper">
        <h1>Very Important Message</h1>
        <h3>{this.props.message}</h3>
        <button
          className="modal-button"
          onClick={() => this.updateModalDisplay()}
        >
          {this.props.buttonMessage}
        </button>
      </div>
    );
  }
}

export default MessageModal;
