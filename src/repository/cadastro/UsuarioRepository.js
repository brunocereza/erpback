const Usuario = require("../../model/cadastro/Usuario");
const Sequelize = require("sequelize");

module.exports = {
  conexao: function (req) {
    return Usuario;
  },
  findByPk: async (req) => {
    const user = await Usuario.findByPk(req.userId);
    return user;
  },
  findOneLogin: async (login) => {
    const user = await Usuario.findOne({
      where: {
        login,
      },
    });
    return user;
  },
  usuarioPaginate: async (req) => {
    const user = await Usuario.findByPk(req.userId);
    const { pagina = 1 } = req.query;
    const options = {
      page: pagina,
      paginate: 10,
      where: { entidade: user.entidade },
      order: [["nome", "ASC"]],
    };
    const { docs, pages } = await Usuario.paginate(options);
    return { docs, pages, pagina };
  },
  pesquisa: async (term, entidade) => {
    const Op = Sequelize.Op;
    var query = `%${term}%`;
    const retorno = await Usuario.findAll({
      raw: true,
      limit: 50,
      where: { nome: { [Op.iLike]: query }, entidade: entidade },
    });
    return retorno;
  },
  usuariosPorPessoa: async (term) => {
    const retorno = await Usuario.findAll({
      where: {
        pessoa_id: term,
      },
    });
    return retorno;
  },
};
