import React, { Component } from 'react';


class AddUser extends Component {
  state={
    value:''
  }
  handleChange = (event) =>{
    this.setState({value:event.target.value});
  }

  handleSubmit = (event) =>{
    event.preventDefault();
    fetch('/api/adduser', {
     method: 'POST',
     headers: {'Content-Type':'application/json'},
     body: JSON.stringify({userName: this.state.value})
    }).then(res=>console.log(res))
  };

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
