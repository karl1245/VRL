import React, { Component } from "react";
import { Home } from "../Home/Home";
import { GoogleLogin } from "react-google-login";
import GoogleMap from "../../components/GoogleMaps";

export class Login extends Component {
  state = {
    isLoggedIn: false,
    username: "",
    isVisible: false
  };

  responseGoogle = googleUser => {
    var id_token = googleUser.getAuthResponse().id_token;

    fetch("/api/googleLogin", {
      method: "POST",
      headers: {
        Acceps: "application/json",
        "content-type": "application/json",
        Authorization: id_token
      }
    }).then(res => {
      res.json().then(res => {
        if (JSON.stringify(res.isLoggedIn) === "false") {
          this.setState({ isLoggedIn: false });
        }
        if (JSON.stringify(res.isLoggedIn) === "true") {
          this.setState({ isLoggedIn: true, isHome: true });
        }
        this.props.logedin(this.state.isLoggedIn);
        // console.log(this.state.isLoggedIn);
      });
      //anything else you want to do(save to localStorage)...
    });
  };

  componentDidMount() {
    fetch("/api/isLoggedIn", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(res => {
      res.json().then(res => {
        if (JSON.stringify(res.isLoggedIn) === "false") {
          this.setState({ isLoggedIn: false });
        }
        if (JSON.stringify(res.isLoggedIn) === "true") {
          this.setState({ isLoggedIn: true, isHome: true });
        }
        this.props.logedin(this.state.isLoggedIn);
        // console.log(this.state.isLoggedIn);
      });
    });

    let tag = document.createElement('script');
    tag.src = "https://apis.google.com/js/platform.js";
    tag.async = true;
    tag.defer = true;

    document.body.appendChild(tag);

    tag = document.createElement('meta');
    tag.name = "google-signin-client_id";
    tag.content = "656090020496-kq2pqe8tp9t3rj7kvp8r5bahf43cjb1v.apps.googleusercontent.com";

    document.head.appendChild(tag);
  }

  login = event => {
    event.preventDefault();
    let { username, password } = this.refs;
    this.setState({ username: username.value });
    this.props.userN(username.value);
    return fetch("/api/login", {
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
        if (JSON.stringify(res.isLoggedIn) === "false") {
          this.setState({ isLoggedIn: false });
        }
        if (JSON.stringify(res.isLoggedIn) === "true") {
          this.setState({ isLoggedIn: true });
        }
        this.props.logedin(this.state.isLoggedIn);
        // console.log(this.state.isLoggedIn);
      });
    });
  };
  beVisible = () => {
    this.setState({ isVisible: true });
  };
  smartID = () => {
    let { isikukood, riik } = this.refs;

    if (isikukood.value.length == 11) {
      if (riik.value == "EE" || riik.value == "LV" || riik.value == "LT") {
        return fetch("/api/smartid", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            isikukood: isikukood.value,
            riik: riik.value
          })
        }).then(
          result =>
            result.json().then(res => {
              this.setState({ isLoggedIn: res.isLoggedIn });
              this.props.logedin(res.isLoggedIn);
            })
          /*   {
          
          if (result.status === 200) {
            console.log(result.json());
          } else {
            console.log("Error");
            throw new Error("Error");
          }
        } */
        );
      }
    }
  };

  render() {
    const smartLogin = (
      <div>
        {" "}
        <input
          className="form-control"
          ref="isikukood"
          id="isikukood"
          type="text"
          placeholder="Sisesta enda isikukood"
          name="isikukood"
        />
        <input
          className="form-control"
          ref="riik"
          id="riik"
          type="text"
          placeholder="Sisesta enda riik(EE , LV , LT)"
          name="riik"
        />
        <button className="btn btn-lg btn-block" onClick={this.smartID}>
          {this.props.keel ? "Log in" : "Sisene"}
        </button>
      </div>
    );
    const home = (
      <React.Fragment>
        <Home username={this.state.username} />
        <GoogleMap />
      </React.Fragment>
    );
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
            placeholder={this.props.keel ? "Username" : "Kasutajanimi"}
            name="username"
          />
          <input
            className="form-control"
            ref="password"
            id="password"
            type="password"
            placeholder={this.props.keel ? "Password" : "Parool"}
            name="password"
          />
          <div className="input-group-item">
            <button
              onClick={this.login}
              type="submit"
              className="btn btn-lg btn-primary btn-block"
            >
              {this.props.keel ? "Log in" : "Logi sisse"}
            </button>
          </div>
          <div className="input-group-item">
            <GoogleLogin
              username={this.state.username}
              clientId="656090020496-s4loae0qcgon2psaacomcfftu57jdomk.apps.googleusercontent.com"
              buttonText="Google Login"
              className="btn btn-lg btn-danger btn-block"
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
            />
          </div>
        </form>
        <div className="form-signin">
          <div className="input-group-item">
            <button className="btn btn-lg btn-block" onClick={this.beVisible}>
              Smart-ID
            </button>
          </div>
          {this.state.isVisible ? smartLogin : null}
        </div>
      </div>
    );
    return <div>{this.state.isLoggedIn ? home : muu}</div>;
  }
}
