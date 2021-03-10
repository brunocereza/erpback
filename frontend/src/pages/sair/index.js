import React, { Component } from "react";

export default class Sair extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.sair();
  }

  sair = async () => {
      var localStorage = window.localStorage;
      localStorage.setItem("token",undefined);
      window.location.href = "/";
    }

  render() {
    return (
        <div></div>
    );
  }
}
