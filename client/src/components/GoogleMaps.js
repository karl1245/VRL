import React, { Component } from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

class maps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      crdLat: 58.37824850000001,
      crdLong: 26.71467329999996
    };
  }

  success = pos => {
    const crd = pos.coords;
    this.setState({ crdLat: crd.latitude, crdLong: crd.longitude });
  };
  componentDidMount() {
    // check for Geolocation support
    if (navigator.geolocation) {
      let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }

      navigator.geolocation.getCurrentPosition(this.success, error, options);
    } else {
      console.log("Geolocation is not supported for this Browser/OS.");
    }
  }

  render() {
    const MyMapComponent = compose(
      withScriptjs,
      withGoogleMap
    )(props => (
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: this.state.crdLat, lng: this.state.crdLong }}
      >
        {
          <Marker
            position={{ lat: this.state.crdLat, lng: this.state.crdLong }}
          />
        }
      </GoogleMap>
    ));

    return (
      <MyMapComponent
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBVsqjRCYqjHfGgi9Yd041rnmzbXuMEqGk&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%`, width: `65%`, margin: `auto`}} />}
        containerElement={<div style={{ height: `400px`, width: `65%`, margin: `auto` }} />}
        mapElement={<div style={{ height: `100%`, width: `65%`, margin: `auto` }} />}
      />
    );
  }
}
export default maps;
