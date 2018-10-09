import React, { Component } from "react";
import "./App.css";
import pilt from "../src/assets/Proto1.png";

class App extends Component {
  state = {
    name: "MINA"
  };

  render() {
    changeHandler = (name) => {
      this.setState({name: name})
    };
    return (
      <div className="App">
            <div className="login">
              <h1>{this.state.name}</h1>
              <form>
                <div className="input-group">
                  <div className="input-group-item" >
                    <input type="text" placeholder="Username"/>
                  </div>
                  <div className="input-group-item" >
                    <input type="password" placeholder="Password" onChange={(name) => this.changeHandler(name)} value={this.state.name}/>
                  </div>
                  <div className="input-group-item" >
                    <button>Log in</button>
                    <button>Sign up</button>
                  </div>
                </div>
              </form>
            </div>
        </div>
    );
    return (
      <div className="App">
        <img src={pilt} width="50%" height="50%" />
      </div>
    );
  }
}

export default App;
