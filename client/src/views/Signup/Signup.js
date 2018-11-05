import React, { Component } from "react";

export class Signup extends Component {
  signup = event => {
    event.preventDefault();
    let { username, password } = this.refs;
    return fetch("/signup", {
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
      if (res.status == 200) {
      }
    });
  };
  render() {
    return (
      <form method="post" className="form-signin">
        <img
          className="mb-4"
          src="https://pressureradio.com/button-images/pressure-radio-chat-button-web-512x512-fill.png"
          alt=""
          width="72"
          height="72"
        />
        <h1 className="">Obsecure Beach</h1>
        <p>Let's sign you up for our nextgen chat application</p>
        <span>Choose an username</span>
        <input
          className="form-control"
          ref="username"
          id="username"
          type="text"
          placeholder="Username"
          name="username"
        />
        <span>Choose a password for your account</span>
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
            onClick={this.signup}
            type="submit"
            className="btn btn-lg btn-primary btn-block"
          >
            Sign up
          </button>
        </div>
      </form>
    );
  }
}
