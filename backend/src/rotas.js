const express = require("express");
const routes = express.Router();
const EntidadeController = require("./controller/EntidadeController");
const IndexController = require("./controller/IndexController");
const MenuController = require("./controller/MenuController");
const PessoaController = require("./controller/PessoaContoller");
const UsuarioController = require("./controller/UsuarioController");

routes.get("/index", IndexController.index);
routes.post("/entidade/salvar", EntidadeController.salvar);
routes.post("/entidade/visualiza", EntidadeController.visualiza);
routes.post("/entidade/busca", EntidadeController.busca);
routes.post("/menu/lista", MenuController.lista);
routes.post("/pessoa/salvar", PessoaController.salvar);
routes.post("/pessoa/lista", PessoaController.lista);
routes.post("/pessoa/visualiza", PessoaController.visualiza);
routes.post("/pessoa/alterar", PessoaController.alterar);
routes.post("/pessoa/pesquisa", PessoaController.pesquisa);
routes.post("/usuario/salvar", UsuarioController.salvar);
routes.post("/usuario/lista", UsuarioController.lista);
routes.post("/usuario/visualiza", UsuarioController.visualiza);
routes.put("/usuario/alterar", UsuarioController.alterar);
routes.post("/pessoa/excluir", PessoaController.excluir);
routes.post("/usuario/excluir", UsuarioController.excluir);

module.exports = routes;
