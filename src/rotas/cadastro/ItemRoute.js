const express = require("express");
const routes = express.Router();
const ItemController = require("../../controller/cadastro/ItemController");

routes.post("/item/editar", ItemController.editar);
routes.post("/item/excluir",ItemController.excluir);
routes.post("/item/findOne", ItemController.findOne);
routes.post("/item/lista", ItemController.lista);
routes.post("/item/pesquisa", ItemController.pesquisa);
routes.post("/item/salvar", ItemController.salvar);
routes.post("/item/visualiza", ItemController.visualiza);
 
module.exports = routes;
