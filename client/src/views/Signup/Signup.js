import React, { Component } from "react";

export class Signup extends Component {
  signup = event => {
    event.preventDefault();
    let { username, password } = this.refs;
    return fetch("/api/signup", {
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
      if (res.status === 200) {
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
        <p>
          {" "}
          {this.props.keel
            ? "Let's sign you up for our nextgen chat application"
            : "Saad teha kasutaja meie uute veebirakendusse"}
        </p>
        <span>
          {this.props.keel ? "Choose an username" : "Vali kasutajanimi"}
        </span>
        <input
          className="form-control"
          ref="username"
          id="username"
          type="text"
          placeholder="Username"
          name="username"
        />
        <span>
          {this.props.keel
            ? "Choose a password for your account"
            : "Sisesta salasõna enda kasutaja jaoks"}
        </span>
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
            {this.props.keel ? "Sign up" : "Liitu"}
          </button>
        </div>
      </form>
    );
  }
}
