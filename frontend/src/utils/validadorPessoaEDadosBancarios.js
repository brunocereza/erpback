module.exports = (pessoa) => {
  let listaValidacao = [];
  listaValidacao.push({
    nome: validaQuantidadeCaracteres(pessoa.nome, 35),
    mensagem: "Nome Muito Extenso",
  });
  listaValidacao.push({
    tipo: validaCampoNulo(pessoa.tipo),
    mensagem: "Tipo Vazio",
  });
  listaValidacao.push({
    cpf: validaCpf(pessoa.cpf),
    mensagem: "Cpf Inválido",
  });
  listaValidacao.push({
    cnpj: validaCnpj(pessoa.cnpj),
    mensagem: "Cnpj Inválido",
  });
  listaValidacao.push({
    endereco: validaQuantidadeCaracteres(pessoa.endereco, 40),
    mensagem: "Endereço Muito Extenso",
  });
  listaValidacao.push({
    bairro: validaQuantidadeCaracteres(pessoa.bairro, 12),
    mensagem: "Bairro Muito Extenso",
  });
  listaValidacao.push({
    debito_conta: validaCampoNulo(pessoa.debito_conta_id),
    mensagem: "Débito Conta Está Vazio",
  });
  listaValidacao.push({
    debito_conta_conta: pessoa.debito_conta !== null && validaCampoNulo(pessoa.debito_conta.conta),
    mensagem: "Conta Corrente Está Vazio",
  });
  listaValidacao.push({
    debito_conta_digito_conta: pessoa.debito_conta !== null && validaCampoNulo(pessoa.debito_conta.digito_conta),
    mensagem: "Dígito Conta Corrente Está Vazio",
  });
  listaValidacao.push({
    debito_conta_agencia: pessoa.debito_conta !== null && pessoa.debito_conta.agencia_debito_conta !== null
     && validaCampoNulo(pessoa.debito_conta.agencia_debito_conta.agencia),
    mensagem: "Agência Está Vazio",
  });
  listaValidacao.push({
    debito_conta_agencia: pessoa.debito_conta !== null && pessoa.debito_conta.agencia_debito_conta !== null
     && validaCampoNulo(pessoa.debito_conta.agencia_debito_conta.digito_agencia),
    mensagem: "Dígito Agência Está Vazio",
  });
  return listaValidacao;
};

function validaCampoNulo(val) {
  if (val === null) {
      return false;
    } else {
      return true;
    }
}

function validaQuantidadeCaracteres(val, qtd) {
  if (val !== null) {
    if (val.length > qtd) {
      return false;
    } else {
      return true;
    }
  }
}

function validaCpf(val) {
  if (val !== null) {
    val = val.replace(/\./g, "");
    val = val.replace("-", "");
    if (val !== null && val.length === 11) {
      var cpf = val.trim();

      cpf = cpf.replace(/\./g, "");
      cpf = cpf.replace("-", "");
      cpf = cpf.split("");

      var v1 = 0;
      var v2 = 0;
      var aux = false;

      for (var i = 1; cpf.length > i; i++) {
        if (cpf[i - 1] != cpf[i]) {
          aux = true;
        }
      }

      if (aux == false) {
        return false;
      }

      for (var i = 0, p = 10; cpf.length - 2 > i; i++, p--) {
        v1 += cpf[i] * p;
      }

      v1 = (v1 * 10) % 11;

      if (v1 == 10) {
        v1 = 0;
      }

      if (v1 != cpf[9]) {
        return false;
      }

      for (var i = 0, p = 11; cpf.length - 1 > i; i++, p--) {
        v2 += cpf[i] * p;
      }

      v2 = (v2 * 10) % 11;

      if (v2 == 10) {
        v2 = 0;
      }

      if (v2 != cpf[10]) {
        return false;
      } else {
        return true;
      }
    } else {
      if (val !== null) {
        return false;
      } else {
        return true;
      }
    }
  }
}

function validaCnpj(val) {
  if (val !== null) {
    val = val.replace(/\./g, "");
    val = val.replace("-", "");
    if (val.length == 18) {
      var cnpj = val.trim();

      cnpj = cnpj.replace(/\./g, "");
      cnpj = cnpj.replace("-", "");
      cnpj = cnpj.replace("/", "");
      cnpj = cnpj.split("");

      var v1 = 0;
      var v2 = 0;
      var aux = false;

      for (var i = 1; cnpj.length > i; i++) {
        if (cnpj[i - 1] != cnpj[i]) {
          aux = true;
        }
      }

      if (aux == false) {
        return false;
      }

      for (var i = 0, p1 = 5, p2 = 13; cnpj.length - 2 > i; i++, p1--, p2--) {
        if (p1 >= 2) {
          v1 += cnpj[i] * p1;
        } else {
          v1 += cnpj[i] * p2;
        }
      }

      v1 = v1 % 11;

      if (v1 < 2) {
        v1 = 0;
      } else {
        v1 = 11 - v1;
      }

      if (v1 != cnpj[12]) {
        return false;
      }

      for (var i = 0, p1 = 6, p2 = 14; cnpj.length - 1 > i; i++, p1--, p2--) {
        if (p1 >= 2) {
          v2 += cnpj[i] * p1;
        } else {
          v2 += cnpj[i] * p2;
        }
      }

      v2 = v2 % 11;

      if (v2 < 2) {
        v2 = 0;
      } else {
        v2 = 11 - v2;
      }

      if (v2 != cnpj[13]) {
        return false;
      } else {
        return true;
      }
    } else {
      if (val !== null) {
        return false;
      } else {
        return true;
      }
    }
  }
}
