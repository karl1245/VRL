import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

export class Header extends Component {
  state = {};

  render() {
    return (
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/login">Log In</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
            <li />
          </ul>
        </nav>
      </header>
    );
  }
}
