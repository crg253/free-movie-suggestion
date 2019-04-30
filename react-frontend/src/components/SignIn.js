import React, { Component } from 'react';

class SignIn extends Component  {
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
    let headers = new Headers();
    headers.set(
      'Authorization','Basic '+ Buffer.from(this.state.name +":"+this.state.password).toString('base64')
    );
    event.preventDefault();
    fetch('api/signin',{
      method:'POST',
      headers: headers
    })
    .then(res=>res.json())
    .then(res=>localStorage.setItem('token', res.token))
  }

  render() {
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

export default SignIn;
