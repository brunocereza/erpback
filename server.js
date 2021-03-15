const env = require("./src/env");
const express = require("express");
const app = express();
const rotas = require("./src/rotas/importacaoRotas");
const bodyParser = require("body-parser");
const cors = require("cors");
const autenticacao = require("./src/middlewares/autenticacao");
const connectionMiddleware = require("./src/middlewares/connection-middleware");

//libera acesso de qualquer lugar
app.use(cors());

//autenticação por token
//app.use(autenticacao);
app.use(connectionMiddleware);

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
console.log("executando");
//rotas
app.use(rotas);

app.listen(process.env.PORT || 3001);
