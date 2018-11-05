import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Login } from "./views/Login/Login";
import { Signup } from "./views/Signup/Signup";
import { Home } from "./views/Home/Home";
import { BrowserRouter, Route, Link, Redirect, Switch } from "react-router-dom";

export class App extends Component {
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps, "asdas");
  }
  state = {
    isLoggedIn: false
  };

  logout = () => {
    fetch("/logout", {
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
    this.setState({isLoggedIn: bool});
  }

  render() {
    const user = (
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link className="btn btn-outline-success my-2 my-sm-0" to="/home">Home</Link>
        </li>
        <li className="nav-item">
          <Link className="btn btn-outline-success my-2 my-sm-0" onClick={this.logout} to="/login">Log out</Link>
        </li>
      </ul>
    );
    const quest = (
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link className="btn btn-outline-success my-2 my-sm-0" to="/login">Log In</Link>
        </li>
        <li className="nav-item">
          <Link className="btn btn-outline-success my-2 my-sm-0" to="/signup">Sign Up</Link>
        </li>
      </ul>
    );
    return (
      <BrowserRouter>
        <div className="head">
          <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-light" >
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                {this.state.isLoggedIn ? user : quest}
              </div>
            </nav>
          </header>
          <div>
          <Switch>
            <Redirect exact from="/" to="/login" />
            <Route path="/login" exact render={(props) => (<Login {...props} setLogin={this.setLogin.bind(this)} />)}/>
            <Route path="/signup" exact render={(props) => (<Signup {...props} setLogin={this.setLogin.bind(this)} />)}/>
            <Route path="/home" exact render={(props) => (<Home {...props} setLogin={this.setLogin.bind(this)} />)}/>
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
