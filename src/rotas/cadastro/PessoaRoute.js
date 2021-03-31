const express = require("express");
const routes = express.Router();
const PessoaController = require("../../controller/cadastro/PessoaController");

routes.post("/pessoa/lista", PessoaController.lista);
routes.post("/pessoa/salvar", PessoaController.salvar);

module.exports = routes;
