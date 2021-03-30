const express = require("express");
const routes = express.Router();
const UsuarioRoute = require("./cadastro/UsuarioRoute");
const PessoaRoute = require("./cadastro/PessoaRoute");

routes.use(UsuarioRoute);
routes.use(PessoaRoute);

module.exports = routes;
