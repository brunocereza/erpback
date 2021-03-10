const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");
const { PrismaClient } = require("@prisma/client");

module.exports = {
    async salvar(req, res) {
        const { login, nome, senha } = req.body;
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url:
                        "postgresql://postgres:postgres@localhost:5432/newT?schema=public",
                },
            },
        });
        if (login !== null && login !== "") {
            if (senha === null)
                return res.status(400).send("Senha Não Digitada");
            if (
                await prisma.usuario.findUnique({
                    where: {
                        login: login,
                    },
                })
            )
                return res.status(400).send("Usuário já existe");
        }
        await bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(senha, salt, async function (err, hash) {
                await prisma.usuario.create({
                    data: { login, nome, senha: hash },
                });
                res.send("sucesso");
            });
        });
    },
    async autenticacao(req, res) {
        const { login, senha } = req.body;
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url:
                        "postgresql://postgres:postgres@localhost:5432/newT?schema=public",
                },
            },
        });
        const usuario = await prisma.usuario.findUnique({
            where: { login: login },
        });

        if (!usuario)
            return res.status(400).send({ error: "Usuario não encontrado" });
        if (!(await bcrypt.compare(senha, usuario.senha)))
            return res.status(400).send({ error: "Senha Inválida" });

        usuario.senha = undefined;
        usuario.id = undefined;

        const token = jwt.sign({ id: usuario.id }, authConfig.secret);

        res.send({ token, usuario });
    },
};
