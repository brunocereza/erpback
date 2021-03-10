const express = require("express");
const routes = express.Router();
const emailController = require("../controller/EmailController");

const urlBackEnd = "/backend";

routes.post(
  urlBackEnd + "/email/enviarEmail",
  emailController.enviarEmail
);

module.exports = routes;
