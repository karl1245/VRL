import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Login } from "./views/Login/Login";
import { Signup } from "./views/Signup/Signup";
import { Home } from "./views/Home/Home";
import { BrowserRouter, Route, Link } from "react-router-dom";

export class App extends Component {
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  state = {
    isLoggedIn: false,
    isEnglish: true
  };

  logout = () => {
    fetch("/api/logout", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(res => {
      res.json().then(res => {
        window.location.reload();
      });
    });
  };

  setLogin(bool) {
    this.setState({ isLoggedIn: bool });
  }

  saveUsername = data => {
    this.setState({ username: data });
  };
  logind = data => {
    this.setState({ isLoggedIn: data });
  };
  eestiKeel = () => {
    const toggle = this.state.isEnglish;
    this.setState({ isEnglish: !toggle });
  };
  render() {
    const user = (
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link className="btn btn-outline-success mx-2 my-sm-0" to="/login">
            {this.state.isEnglish ? "Home" : "Kodu"}
          </Link>
        </li>
        <li className="nav-item">
          <Link
            onClick={this.logout}
            className="btn btn-outline-success mx-2 my-sm-0"
            to="/login"
          >
            {this.state.isEnglish ? "Log out" : "Logi välja"}
          </Link>
        </li>
        <li className="nav-item btn btn-outline-success mx-2 my-sm-0">
          {this.state.isEnglish ? "Welcome," : "Tere,"} {this.state.username}
        </li>
      </ul>
    );
    const quest = (
      
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link className="btn btn-outline-success mx-2 my-sm-0" to="/login">
            {this.state.isEnglish ? "Log in" : "Logi sisse"}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="btn btn-outline-success mx-2 my-sm-0" to="/signup">
            {this.state.isEnglish ? "Sign up" : "Loo kasutaja"}
          </Link>
        </li>
        <li
          onClick={this.eestiKeel}
          className="nav-item btn btn-outline-success mx-2 my-sm-0"
        >
          {this.state.isEnglish ? "Eesti keel" : "English"}
        </li>
      </ul>
    );
    return (
      <BrowserRouter>
        <div className="head">
          <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse">
                {this.state.isLoggedIn ? user : quest}
              </div>
            </nav>
          </header>
          <div>
            <Route
              path="/login"
              exact
              render={props => (
                <Login
                  keel={this.state.isEnglish}
                  logedin={this.logind}
                  userN={this.saveUsername}
                  {...props}
                  setLogin={this.setLogin.bind(this)}
                />
              )}
            />
            <Route
              path="/signup"
              exact
              render={props => (
                <Signup
                  keel={this.state.isEnglish}
                  {...props}
                  setLogin={this.setLogin.bind(this)}
                />
              )}
            />
            <Route
              path="/home"
              exact
              render={props => (
                <Home
                  keel={this.state.isEnglish}
                  setLogin={this.setLogin.bind(this)}
                />
              )}
            />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
