import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    username: "",
    password: "",
  };
  
  constructor(){
    super();
    this.submit = this.submit.bind(this);
    console.log();
    
  }

  handleUsernameChange(e){
    this.setState({username: e.target.value})
  }

  handlePasswordChange(e){
    this.setState({password: e.target.value})
  }

  submit(event) {
    event.preventDefault();
    let {username, password} = this.state;
    console.log(username)
    return fetch('/api/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
        })
    }).then((res)=>{
      fetch('/home', {
        method: 'GET',
      }).then((r)=>{
        var s = r.body.getReader();

        console.log(s.read());
        return r.body;
        
      })
    }
    )
  }

  render() {
    return (
      <div className="App">
            <div className="login">
              <h1>Login page</h1>
              <form method="post">
                <div className="input-group">
                  <div className="input-group-item" >
                    <input id="username" type="text" placeholder="Username" name="username" value={this.state.username} onChange={this.handleUsernameChange.bind(this)}/>
                  </div>
                  <div className="input-group-item" >
                    <input id="password" type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handlePasswordChange.bind(this)}/>
                  </div>
                </div>
              </form>
              <div className="input-group-item" >
                    <button type="submit" onClick={this.submit.bind(this)}>Log in</button>
                    <button>Sign up</button>
                  </div>
            </div>
        </div>
    );
  }
}

export default App;
