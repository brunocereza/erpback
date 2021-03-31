

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
  async salvar(req,res){
    async function main(req) {
      const {logradouro,cep,bairro,numero,complemento,cidade_id,estado_id,
        cpf_cnpj,nome,nome_fantasia,telefone,email} = req.body;
      const pessoa = await req.connection.pessoa.create({data:{cpf_cnpj,nome,nome_fantasia,
        endereco: {
          create:{logradouro,cep,bairro,numero,
            complemento,cidade_id,estado_id},
        },
        email,telefone}});
      return pessoa
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
  }
}