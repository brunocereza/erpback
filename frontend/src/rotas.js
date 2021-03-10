import React, { Component } from "react";
import ProtectedRoute from "./services/protectedRoute";
import api from "./services/api";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Usuario from "./pages/cadastro/usuario/index";
import EsqueceuSenha from "./pages/esqueceuSenha";
import Sair from "./pages/sair";

export default class Rotas extends Component {
  constructor(props) {
    super(props);
    this.state = { entidades: [], entidade: null, adm: null };
    // this.recebeListaMenu();
  }

  // recebeListaMenu = async () => {
  //   var localStorage = window.localStorage;
  //   var token = localStorage.getItem("token");
  //   var tipo_usuario = localStorage.getItem("tipo_usuario");

  //   try {
  //     const resposta = await api.post("/menu/lista?e=public", "", {
  //       headers: { token: "Baer " + token, tipo_usuario: tipo_usuario },
  //     });
  //     this.setState({ menus: resposta.data.menus });
  //   } catch (e) {
  //     localStorage.setItem("token", undefined);
  //   }
  // };

  render() {
    // let menu = <Menu />;
    var localStorage = window.localStorage;
    var token = localStorage.getItem("token");
    var tipo_usuario = localStorage.getItem("tipo_usuario");

    return (
      <BrowserRouter>
        {token !== null && token.length > 10}
        {token !== null &&
          token.length > 10 &&
          window.location.pathname == "/" && <Home />}

        <div
          className={
            window.location.pathname == "/" ||
            window.location.pathname == "/esqueceuSenha"
              ? ""
              : "principal"
          }
        >
          <Switch>
            <Route
              exact
              path="/"
              component={token === null || token.length < 10 ? Login : null}
            />

            <Route exact path="/esqueceuSenha" component={EsqueceuSenha} />
            <ProtectedRoute
              path="/usuario"
              component={Usuario}
              menus={this.state.menus}
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
