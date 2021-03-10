const Entidade = require("../model/Entidade");
const connection = require("../config/database");
const Sequelize = require("sequelize");

module.exports = {
  conexao: function (req) {
    const con = new Sequelize(connection);
    Entidade.init(con);
    return Entidade;
  },
};
