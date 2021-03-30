const express = require("express");
const routes = express.Router();
const PessoaController = require("../../controller/cadastro/PessoaController");

routes.post("/pessoa/lista", PessoaController.lista);

module.exports = routes;
