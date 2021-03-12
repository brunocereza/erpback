const express = require("express");
const routes = express.Router();
const UsuarioController = require("../../controller/cadastro/UsuarioController");

routes.post("/usuario/salvar", UsuarioController.salvar);
routes.post("/usuario/autenticacao", UsuarioController.autenticacao);
routes.post("/teste",UsuarioController.teste);

module.exports = routes;
