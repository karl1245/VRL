import React, { Component } from "react";
import "./Home.css";
import io from "socket.io-client";

export class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      message: "",
      messages: []
    };

    const host = "https://obscure-beach-22779.herokuapp.com";
    const host2 = "localhost:5000";
    this.socket = io(host);

    this.socket.on("RECEIVE_MESSAGE", function(data) {
      addMessage(data);
    });

    const addMessage = data => {
      this.setState({ messages: [...this.state.messages, data] });
    };

    this.sendMessage = ev => {
      ev.preventDefault();
      this.socket.emit("SEND_MESSAGE", {
        author: this.state.username,
        message: this.state.message
      });
      this.setState({ message: "" });
    };
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-8 col-lg-6 mx-auto">
            <div className="card">
              <div className="card-body">
                <div className="card-title text-center">
                  {this.props.keel ? "Global chat" : "Jututuba"}
                </div>
                <hr />
                <div className="row">
                  <div className="messages">
                    {this.state.messages.map(message => {
                      return (
                        <div key={Math.random() * 100000}>
                          {message.author}: {message.message}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div className="row" >
                  <div class="col-sm-12 col-lg-4 ">
                  <input
                    type="text"
                    placeholder={this.props.keel ? "Username" : "Kasutajanimi"}
                    value={this.state.username}
                    onChange={ev => this.setState({ username: ev.target.value })}
                    className="form-control"
                    id="ex2"
                  />
                  </div>
                </div>
                <br />
                <input
                  type="text"
                  placeholder={this.props.keel ? "Message" : "Sõnum"}
                  className="form-control"
                  value={this.state.message}
                  onChange={ev => this.setState({ message: ev.target.value })}
                />
                <br />
                <button
                  onClick={this.sendMessage}
                  className="btn btn-primary form-control"
                >
                  {this.props.keel ? "Send" : "Saada"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
