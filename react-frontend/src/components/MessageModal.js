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
        <h3 data-test="modal-message">{this.props.message}</h3>
        <button
          data-test="modal-response-button"
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
