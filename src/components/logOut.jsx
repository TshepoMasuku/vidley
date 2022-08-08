import React from "react";
import auth from "../services/authService"

class LogOut extends React.Component {
  componentDidMount() {
    auth.logOut();
    setTimeout(() => (window.location = "/"), 1111);
  }

  render() {
    return null;
  }
}

export default LogOut;
