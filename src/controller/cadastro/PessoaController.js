

module.exports = {
  async lista(req, res) {
    async function main(req) {
        const lista = await req.connection.pessoa.findMany();
        return lista
    }
    main(req)
    .then(resp => {
        res.send(resp);
    })
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await req.connection.$disconnect()
    })
  },
}