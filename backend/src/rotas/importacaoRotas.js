const express = require("express");
const routes = express.Router();
const UsuarioRoute = require("./cadastro/UsuarioRoute");

routes.use(UsuarioRoute);


module.exports = routes;
