import React, { Component } from 'react';


class AddUser extends Component {
  state={
    name:'',
    password:''
  }
  handleNameChange = (event) =>{
    this.setState({name:event.target.value});
  }
  handlePasswordChange = (event) =>{
    this.setState({password:event.target.value})
  }

  handleSubmit = (event) =>{
    event.preventDefault();
    fetch('/api/adduser', {
     method: 'POST',
     headers: {'Content-Type':'application/json'},
     body: JSON.stringify({userName: this.state.name, password:this.state.password})
    }).then(res=>console.log(res))
  };

  render() {
    console.log(this.state.name)
    console.log(this.state.password)
    return (
      <div>
        <form onSubmit={this.handleSubmit}>

          <label>
            Name:
            <input type="text" value={this.state.name} onChange={this.handleNameChange} />
          </label>

          <label>
            Password:
            <input type="text" value={this.state.password} onChange={this.handlePasswordChange}/>
          </label>

          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default AddUser;
