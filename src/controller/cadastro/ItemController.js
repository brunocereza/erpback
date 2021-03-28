const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
      db: {
          url:
              process.env.DATABASE_URL+"public",
      },
  },
});

module.exports = {
  async lista(req, res) {
    const pages = await prisma.item.findMany({ take: 10});
    res.send(pages);
  },
  async salvar(req, res) {
    const item = await prisma.item.create(req.body);
    res.send(item);
  },
  async excluir(req, res) {
    await prisma.item.delete({
      where: {
        id: req.body.id,
      },
    });
    res.send("Excluido com Sucesso");
  },
  async visualiza(req, res) {
    const item = await prisma.item.findUnique({
      where: {
        id: req.body.id,
      },
    });
    res.send(item);
  },
  async editar(req, res) {
    const select = { where: { id: req.body.id } };
    const item = await prisma.item.update({where:{ id: req.body.id}, data:[req.body] });
    res.send(item);
  },
  async pesquisa(req, res) {
    const itens = await ItemRepository.pesquisa(req,req.body.pesquisa);
    res.send(itens);
  },
  async findOne(req, res) {
    const item = await ItemRepository.conexao(req).findByPk(req.body.pesquisaId,{
      attributes: ["id", "descricao","quantidade"],
      include: [
        {
          association: "item_entrada",
        },
        {
          association: "item_saida",
          include: [
            {
              association: "centro_de_custo"
            },
            {
              association: "elemento_de_custo"
            }
          ]
        },
      ],
    });
    res.send(item);
  },
};
