import React, { Component } from "react";

export class Home extends Component {
  componentDidMount() {
    console.log(this.props);
  }
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
  render() {
    return <div></div>;
  }
}
