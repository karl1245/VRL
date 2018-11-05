import React, { Component } from "react";
import { Home } from "../Home/Home";
import { GoogleLogin } from 'react-google-login';

export class Login extends Component {
  constructor(props){
    super(props)
    this.setLogin = props.setLogin;
  }
  state = {
    isLoggedIn: false
  };

  responseGoogle = (googleUser) => {
    var id_token = googleUser.getAuthResponse().id_token;
    
    fetch("/googleLogin", {
      method: "POST",
      headers: {
        Acceps: "application/json",
      "content-type": "application/json",
      "Authorization": id_token
      }
    }).then(res => {
      res.json().then(res => {
        if (JSON.stringify(res.isLoggedIn) == "false") {
          this.setState({ isLoggedIn: false });
          this.setLogin(false)
        }
        if (JSON.stringify(res.isLoggedIn) == "true") {
          this.setState({ isLoggedIn: true, isHome: true });
          this.setLogin(true)
        }
        console.log(this.state.isLoggedIn);
      });
    //anything else you want to do(save to localStorage)...
    })
  }
  
  componentDidMount() {
    fetch("/isLoggedIn", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    }).then(res => {
      res.json().then(res => {
        if (JSON.stringify(res.isLoggedIn) == "false") {
          this.setState({ isLoggedIn: false });
        }
        if (JSON.stringify(res.isLoggedIn) == "true") {
          this.setState({ isLoggedIn: true, isHome: true });
        }
        console.log(this.state.isLoggedIn);
      });
    });
  }

  login = event => {
    event.preventDefault();
    let { username, password } = this.refs;
    return fetch("/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    }).then(res => {
      res.json().then(res => {
        if (JSON.stringify(res.isLoggedIn) == "false") {
          this.setLogin(false);
          this.setState({ isLoggedIn: false });
        }
        if (JSON.stringify(res.isLoggedIn) == "true") {
          this.setLogin(true);
          this.setState({ isLoggedIn: true });
        }
        console.log(this.state.isLoggedIn);
      });
    });
  };
  render() {
    const home = <Home hello={this.state.isLoggedIn} />;
    const muu = (
      <div>
      <form method="post" className="form-signin">
        <img
          className="mb-4"
          src="https://pressureradio.com/button-images/pressure-radio-chat-button-web-512x512-fill.png"
          alt=""
          width="72"
          height="72"
        />
        <h1 className="form-signin-heading">Obsecure Beach</h1>
        <input
          className="form-control"
          ref="username"
          id="username"
          type="text"
          placeholder="Username"
          name="username"
        />
        <input
          className="form-control"
          ref="password"
          id="password"
          type="password"
          placeholder="Password"
          name="password"
        />
        <div className="input-group-item">
          <button
            onClick={this.login}
            type="submit"
            className="btn btn-lg btn-primary btn-block"
          >
            Log in
          </button>
        </div>
        <div className="input-group-item">
          <GoogleLogin
            clientId='656090020496-s4loae0qcgon2psaacomcfftu57jdomk.apps.googleusercontent.com'
            buttonText="Google Login"
            className="btn btn-lg btn-danger btn-block"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            />
        </div>
      </form>
    </div>
    );
    return <div>{this.state.isLoggedIn ? home : muu}</div>;
  }
}
