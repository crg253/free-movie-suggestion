import React, { Component } from 'react';
import axios from 'axios';


class AddUser extends Component {
  state={
    value:''
  }
  handleChange = (event) =>{
    this.setState({value:event.target.value});
  }
  handleSubmit = (event) =>{
    axios.post('/api/adduser', { userName:this.state.value })
      .then(res => {
        console.log(res);
        console.log(res.data);
    })
  }

  render() {
    console.log(this.state.value)
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default AddUser;
