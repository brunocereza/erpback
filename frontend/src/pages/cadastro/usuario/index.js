import React, { Component } from "react";
import { Row, Col, FormControl, Form } from "react-bootstrap";
import { Container, Header, Button, Divider, Segment } from "semantic-ui-react";

import api from "../../../services/api";
import Select from "react-select";
import renomearChave from "../../../services/renomearChave";
import QrCode from "react.qrcode.generator";
import Parcelas from "../../../enum/parcelasEnum";
import {
  addMonths,
  setDate,
  getYear,
  getMonth,
  getDate,
  setMonth,
  setYear,
} from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import Meses from "../../../enum/mes";
import requisicoes from "../../../utils/requisicoes";

export default class Usuario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      login: null,
      senha: null,
      tipo_usuario: null,
      pessoa_id: null,
      options: [],
      pessoa: null,
      qrCodeLink: "",
      infoPessoa: null,
      acao: null,
      selectTipo: null,
      listaTipoTitulo: [],
      parcelas: Parcelas,
      infoParcelasMensalidade: [],
      infoParcelasTitulo: [],
      meses: Meses,
      tipo_pagamento: null,
      efetuar_cobranca: false,
      listaUsuario: [],
      usuario_id: null,
      usuario: null,
    };
    this.alteracao = this.alteracao.bind(this);
    this.alteracaoSelectPessoa = this.alteracaoSelectPessoa.bind(this);
    this.visualizacao();
    this.listaTipoTitulo();
  }

  visualizacao = async () => {
    if (this.props.location.query !== undefined) {
      const resposta = await api.post(
        "/usuario/visualiza" + requisicoes.entidade,
        this.props.location.query,
        requisicoes.header
      );
      this.setState(resposta.data);
      //pessoa
      const respPessoa = await api.post(
        "/pessoa/pessoaIdNome" + requisicoes.entidade,
        { id: resposta.data.pessoa_id },
        requisicoes.header
      );
      let p = renomearChave(respPessoa.data, "id", "value");
      p = renomearChave(p, "nome", "label");
      this.setState({ pessoa: p });
      //usuario
      if (resposta.data.tipo_usuario === "dependente") {
        const resPessoa = await api.post(
          "/pessoa/visualiza" + requisicoes.entidade,
          { id: respPessoa.data.id },
          requisicoes.header
        );
        const respPessoaTitular = await api.post(
          "/pessoa/pessoaIdNome" + requisicoes.entidade,
          { id: resPessoa.data.titular_id },
          requisicoes.header
        );
        let p = renomearChave(respPessoaTitular.data, "id", "value");
        p = renomearChave(p, "nome", "label");
        this.setState({ usuario: p });
        this.setState({ usuario_id: p.id });
      }
      this.setState({ qrCodeLink: resposta.data.id });
      const respPessoaInfo = await api.post(
        "/pessoa/visualiza" + requisicoes.entidade,
        { id: resposta.data.pessoa_id },
        requisicoes.header
      );
      this.setState({ infoPessoa: respPessoaInfo.data });
      if (
        respPessoaInfo.data.acao !== undefined &&
        respPessoaInfo.data.acao !== null
      ) {
        const respAcao = await api.post(
          "/acao/visualiza" + requisicoes.entidade,
          { id: respPessoaInfo.data.acao.id },
          requisicoes.header
        );
        this.setState({ acao: respAcao.data });
      }
    }
  };

  listaTipoTitulo = async () => {
    const resposta = await api.post(
      "/tipoTitulo/lista" + requisicoes.entidade,
      {},
      requisicoes.header
    );
    this.setState({ listaTipoTitulo: resposta.data });
  };

  alteracao(event) {
    if (event.target.name === "tipo_usuario") {
      this.setState({ tipo_usuario: event.target.value });
    } else if (event.target.name === "tipo_pagamento") {
      this.setState({ [event.target.name]: event.target.value });
      this.geraParcelas(event);
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  }

  handleSubmit = (event) => {
    if (
      this.state.tipo_usuario === "dependente" &&
      this.state.usuario === null
    ) {
      alert("Campo Titular Obrigatório");
    } else {
      this.submit();
    }
    event.preventDefault();
  };

  submit = async () => {
    let retorno = "";
    const dados = {
      nome: this.state.pessoa.label,
      login: this.state.login,
      senha: this.state.senha,
      tipo_usuario: this.state.tipo_usuario,
      pessoa_id: this.state.pessoa_id,
      valor_mensalidade: this.state.valor_mensalidade,
      acao_id: this.state.acao !== null ? this.state.acao.id : null,
      cobranca_titulo: this.state.infoParcelasTitulo,
      cobranca_mensalidade: this.state.infoParcelasMensalidade,
    };
    if (this.state.id !== null) {
      retorno = await api.put(
        "/usuario/alterar" + requisicoes.entidade + "&id=" + this.state.id,
        dados,
        requisicoes.header
      );
      if (this.state.efetuar_cobranca === true) {
        retorno = await api.post("/usuario/alteraPessoa" + requisicoes.entidade, dados,
          requisicoes.header);
        retorno = await api.post("/usuario/cobranca" + requisicoes.entidade, dados,
          requisicoes.header);
      }
    } else {
      retorno = await api.post("/usuario/salvar" + requisicoes.entidade, dados,
        requisicoes.header);
      if (retorno.data === "sucesso") {
        if (this.state.tipo_usuario === "dependente") {
          retorno = await api.post(
            "/usuario/visualiza" + requisicoes.entidade,
            { id: this.state.usuario_id },
            requisicoes.header
          );
          const dadosInserirTitular = {
            id: this.state.pessoa_id,
            titular_id: retorno.data.pessoa_id,
          };
          retorno = await api.post(
            "/pessoa/inserirTitular" + requisicoes.entidade,
            dadosInserirTitular,
            requisicoes.header
          );
        }
        if (this.state.efetuar_cobranca === true) {
          retorno = await api.post(
            "/usuario/alteraPessoa" + requisicoes.entidade,
            dados,
            requisicoes.header
          );
          retorno = await api.post("/usuario/cobranca" + requisicoes.entidade, dados,
            requisicoes.header
          );
        }
      }
    }
    if (retorno != null) {
      window.location.href = "/usuario/lista";
    }
  };

  pesquisaUsuario = async () => {
    setTimeout(async () => {
      const retorno = await api.post(
        "/usuario/pesquisaTitulares" + requisicoes.entidade,
        { pesquisa: document.getElementById("pesquisaUsuario").value },
        requisicoes.header
      );
      let lista = [];
      retorno.data.forEach((element) => {
        let objeto = renomearChave(element, "id", "value");
        objeto = renomearChave(objeto, "nome", "label");
        lista.push(objeto);
      });
      this.setState({ listaUsuario: lista });
    }, 500);
  };
  alteracaoSelectUsuario = async (event) => {
    this.setState({ usuario_id: event.value });
    this.setState({ usuario: event });
  };
  alteracaoSelectPessoa = async (event) => {
    this.setState({ pessoa_id: event.value });
    this.setState({ pessoa: event });
    const resposta = await api.post(
      "/pessoa/visualiza" + requisicoes.entidade,
      { id: event.value },
      requisicoes.header
    );
    this.setState({ infoPessoa: resposta.data });
    if (resposta.data.acao !== null) {
      const respAcao = await api.post(
        "/acao/visualiza" + requisicoes.entidade,
        { id: resposta.data.acao.id },
        requisicoes.header
      );
      this.setState({ acao: respAcao.data });
    } else {
      this.setState({ acao: null });
    }
    /*
        const repostaHistoricoAcao = await api.post("/historicoAcao/historicoPorStatusEPessoaCompra?e=" + e, { pessoa: { id: resposta.data.id } }, { headers: { token: "Baer " + token } });
        let codigo = null;
        repostaHistoricoAcao.data.map(e => {
          codigo = e.id;
        });
        if (codigo !== null) {
          const repostaAcaoHistorico = await api.post("/acaoHistorico/acaoPorHistorico?e=" + e, { id: repostaHistoricoAcao.data.id }, { headers: { token: "Baer " + token } });
          if (repostaAcaoHistorico.data !== "") {
            const repostaAcao = await api.post("/acao/visualiza?e=" + e, { id: repostaAcaoHistorico.data.id }, { headers: { token: "Baer " + token } });
            this.setState({ acao: repostaAcao });
          }
        }*/
  };

  novaAcao = async () => {
    const resposta = await api.post(
      "/acao/salvar" + requisicoes.entidade,
      {},
      requisicoes.header
    );
    this.setState({ acao: resposta.data });
    this.setState({ efetuar_cobranca: true });
  };

  alteraAcao = async (event) => {
    this.setState({ selectTipo: event.target.value });
    const dados = {
      id: this.state.acao.id,
      data_emissao: this.state.acao.data_emissao,
      status: this.state.acao.status,
      tipo_titulo_id: parseInt(event.target.value),
    };
    const resposta = await api.post("/acao/alterar" + requisicoes.entidade, dados,
      requisicoes.header);
    const respostaTipoTitulo = await api.post(
      "/tipotitulo/visualiza" + requisicoes.entidade,
      { id: resposta.data.tipo_titulo_id },
      requisicoes.header
    );
    let acao = this.state.acao;
    acao.tipo_titulo = respostaTipoTitulo.data;
    this.setState({ acao: acao });
  };

  excluir = async () => {
    const resposta = await api.post(
      "/usuario/excluir" + requisicoes.entidade + "&id=" + this.state.id,
      {},
      requisicoes.header
    );
    if (resposta.data !== null) {
      window.location.href = "/usuario/lista";
    }
  };

  verificarMes = (data) => {
    if (getMonth(data) === 0) {
      data = setMonth(data, 11);
      data = setYear(data, getYear(data) - 1);
      return data;
    } else {
      return data;
    }
  };

  geraParcelas = (event) => {
    const parcelas = [];
    let dataVencimento = "";
    const dataHoje = zonedTimeToUtc(new Date(), "America/Sao_Paulo");
    if (event.target.value === "avista") {
      if (getDate(dataHoje) > 15) {
        const setDia = setDate(
          dataHoje,
          this.state.acao.tipo_titulo.dia_vencimento
        );
        dataVencimento = addMonths(setDia, 1);
      } else {
        dataVencimento = setDate(
          dataHoje,
          this.state.acao.tipo_titulo.dia_vencimento
        );
      }
      const mes = getMonth(dataVencimento) + 1;
      if (event.target.name === "forma_pagamento_mensalidade") {
        parcelas.push({
          numero: "Única",
          valor: this.state.acao.tipo_titulo.valor_mensalidade,
          data_vencimento:
            getYear(dataVencimento) +
            "-" +
            (getMonth(dataVencimento).toString().length === 1
              ? "0" + mes
              : mes) +
            "-" +
            (getDate(dataVencimento).toString().length === 1
              ? "0" + getDate(dataVencimento)
              : getDate(dataVencimento)),
        });
        this.setState({ infoParcelasMensalidade: parcelas });
      } else {
        parcelas.push({
          numero: "Única",
          valor: this.state.acao.tipo_titulo.valor_titulo,
          data_vencimento:
            getYear(dataVencimento) +
            "-" +
            (getMonth(dataVencimento).toString().length === 1
              ? "0" + mes
              : mes) +
            "-" +
            (getDate(dataVencimento).toString().length === 1
              ? "0" + getDate(dataVencimento)
              : getDate(dataVencimento)),
        });
        this.setState({ infoParcelasTitulo: parcelas });
      }
    } else {
      const numeroParcela = event.target.value.toString().replace("x", "");
      var acresMes = 1;
      if (event.target.name === "forma_pagamento_mensalidade") {
        for (var i = 1; i < parseInt(numeroParcela) + 1; i++) {
          if (
            getDate(dataHoje) > this.state.acao.tipo_titulo.dia_vencimento &&
            i === 1
          ) {
            const setDia = setDate(
              dataHoje,
              this.state.acao.tipo_titulo.dia_vencimento
            );
            dataVencimento = addMonths(setDia, 1);
            acresMes = acresMes + 1;
          } else {
            const addDia = setDate(
              dataHoje,
              this.state.acao.tipo_titulo.dia_vencimento
            );
            dataVencimento = addMonths(addDia, acresMes);
            acresMes++;
          }
          const mes = getMonth(dataVencimento) + 1;
          parcelas.push({
            numero: i,
            valor: this.state.acao.tipo_titulo.valor_mensalidade,
            data_vencimento:
              getYear(dataVencimento) +
              "-" +
              (mes.toString().length === 1 ? "0" + mes : mes) +
              "-" +
              (getDate(dataVencimento).toString().length === 1
                ? "0" + getDate(dataVencimento)
                : getDate(dataVencimento)),
            mes_referencia:
              Meses[
                getMonth(dataVencimento) - 1 === -1
                  ? 11
                  : getMonth(dataVencimento) - 1
              ].value,
            ano_referencia:
              getMonth(dataVencimento) - 1 === -1
                ? getYear(dataVencimento) - 1
                : getYear(dataVencimento),
          });
        }
        this.setState({ infoParcelasMensalidade: parcelas });
      } else {
        for (var ind = 1; ind < parseInt(numeroParcela) + 1; ind++) {
          if (
            getDate(dataHoje) > this.state.acao.tipo_titulo.dia_vencimento &&
            ind === 1
          ) {
            const setDia = setDate(
              dataHoje,
              this.state.acao.tipo_titulo.dia_vencimento
            );
            dataVencimento = addMonths(setDia, 1);
            acresMes = acresMes + 1;
          } else {
            const addDia = setDate(
              dataHoje,
              this.state.acao.tipo_titulo.dia_vencimento
            );
            dataVencimento = addMonths(addDia, acresMes);
            acresMes++;
          }
          const mes = getMonth(dataVencimento) + 1;

          parcelas.push({
            numero: ind,
            valor: this.state.acao.tipo_titulo.valor_titulo / numeroParcela,
            data_vencimento:
              getYear(dataVencimento) +
              "-" +
              (mes.toString().length === 1 ? "0" + mes : mes) +
              "-" +
              (getDate(dataVencimento).toString().length === 1
                ? "0" + getDate(dataVencimento)
                : getDate(dataVencimento)),
          });
        }
        this.setState({ infoParcelasTitulo: parcelas });
      }
    }
  };

  alteraValorParcelas = (event) => {
    let lista = [];
    const indice = event.target.id.toString().substring(12, 14);
    if (event.target.name === "valorParcelaMensalidade") {
      lista = this.state.infoParcelasMensalidade;
      lista.splice(parseInt(indice), 1, {
        numero: parseInt(indice) + 1,
        valor: event.target.value,
        data_vencimento: lista[parseInt(indice)].data_vencimento,
        mes_referencia: lista[parseInt(indice)].mes_referencia,
        ano_referencia: lista[parseInt(indice)].ano_referencia,
      });
    } else {
      lista = this.state.infoParcelasTitulo;
      lista.splice(parseInt(event.target.id.toString().substring(18, 20)), 1, {
        numero: parseInt(event.target.id.toString().substring(18, 20)) + 1,
        valor: event.target.value,
      });
    }

    if (lista.find((e) => e.valor.toString() === "NaN")) {
      lista.forEach((element) => {
        if (element.valor.toString() === "NaN") {
          element.valor = "";
        }
      });
    }
    if (event.target.name === "valorParcelaMensalidade") {
      this.setState({ infoParcelasMensalidade: lista });
    } else {
      this.setState({ infoParcelasTitulo: lista });
    }
  };

  alteraDataVencimentoParcelas = (event) => {
    let lista = [];
    const indice = event.target.id.toString().substring(25, 27);
    if (event.target.name === "dataVencimentoParcelaMensalidade") {
      lista = this.state.infoParcelasMensalidade;
      if (event.target.value !== "") {
        lista.splice(parseInt(indice), 1, {
          numero: parseInt(indice) + 1,
          valor: lista[parseInt(indice)].valor,
          data_vencimento: event.target.value,
          mes_referencia: lista[parseInt(indice)].mes_referencia,
          ano_referencia: lista[parseInt(indice)].ano_referencia,
        });
      }
    } else {
      lista = this.state.infoParcelasTitulo;
      if (event.target.value !== "") {
        lista.splice(
          parseInt(event.target.id.toString().substring(20, 22)),
          1,
          {
            numero: parseInt(event.target.id.toString().substring(20, 22)) + 1,
            valor:
              lista[parseInt(event.target.id.toString().substring(20, 22))]
                .valor,
            data_vencimento: event.target.value,
          }
        );
      }
    }
    if (event.target.name === "dataVencimentoParcelaMensalidade") {
      this.setState({ infoParcelasMensalidade: lista });
    } else {
      this.setState({ infoParcelasTitulo: lista });
    }
  };

  alteracaoMesReferencia = (event) => {
    let lista = this.state.infoParcelasMensalidade;
    const indice = event.target.name.toString().substring(13, 15);
    lista.splice(indice, 1, {
      numero: parseInt(indice) + 1,
      valor: lista[parseInt(indice)].valor,
      data_vencimento: lista[parseInt(indice)].data_vencimento,
      mes_referencia: event.target.value,
      ano_referencia: lista[parseInt(indice)].ano_referencia,
    });
    this.setState({ infoParcelasMensalidade: lista });
  };

  alteracaoAnoReferencia = (event) => {
    let lista = this.state.infoParcelasMensalidade;
    const indice = event.target.name.toString().substring(13, 15);
    lista.splice(indice, 1, {
      numero: parseInt(indice) + 1,
      valor: lista[parseInt(indice)].valor,
      data_vencimento: lista[parseInt(indice)].data_vencimento,
      mes_referencia: lista[parseInt(indice)].mes_referencia,
      ano_referencia: event.target.value,
    });
    this.setState({ infoParcelasMensalidade: lista });
  };
  voltar() {
    window.location.href = "/usuario/lista";
  }
  pesquisaPessoa = async () => {
    setTimeout(async () => {
      const retorno = await api.post(
        "/pessoa/pesquisa" + requisicoes.entidade,
        { pesquisa: document.getElementById("pesquisaPessoa").value },
        requisicoes.header
      );
      let lista = [];
      retorno.data.forEach((element) => {
        let objeto = renomearChave(element, "id", "value");
        objeto = renomearChave(objeto, "nome", "label");
        lista.push(objeto);
      });
      this.setState({ options: lista });
    }, 500);
  };

  render() {
    return (
      <Container className="pagina">
        <Header as="h1" dividing>
          Usuario
        </Header>
        {/* {this.state.qrCodeLink === undefined} */}
        <Segment Raised>
          <Container textAlign="center">
            <QrCode
              value={this.state.qrCodeLink}
              size={300}
              background="white"
            />
          </Container>
        </Segment>
        <Divider />
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col sm={6}>
              <Form.Label>Pessoa</Form.Label>
              <Select
                placeholder="Digite para buscar"
                name="pessoa"
                value={this.state.pessoa}
                onChange={this.alteracaoSelectPessoa}
                options={this.state.options}
                onKeyDown={this.pesquisaPessoa}
                inputId="pesquisaPessoa"
                isDisabled={this.state.id !== null}
              />
            </Col>
            <Col sm={6}>
              <Form.Label>Login</Form.Label>
              <FormControl
                placeholder="Login"
                aria-label="Login"
                aria-describedby="basic-addon1"
                name="login"
                onChange={this.alteracao}
                required
                defaultValue={this.state.login}
              />
            </Col>
            <Col sm={6}>
              <Form.Label>Senha</Form.Label>
              <FormControl
                placeholder="Senha"
                aria-label="Senha"
                type="password"
                aria-describedby="basic-addon1"
                name="senha"
                onChange={this.alteracao}
              />
            </Col>

            <Col sm={6}>
              <Form.Label>Perfil</Form.Label>
              <Form.Control
                placeholder="Tipo"
                as="select"
                name="tipo_usuario"
                onChange={this.alteracao}
                checked={this.state.selectTipo}
                required
                value={this.state.tipo_usuario}
              >
                <option></option>
                <option value="titular">Titular</option>
                <option value="dependente">Dependente</option>
                <option value="administrador">Administrador</option>
                <option value="temporario">Temporário</option>
                <option value="funcionario">Funcionário</option>
                <option value="caixa">Caixa</option>
                <option value="medico">Médico</option>
                <option value="portaria">Portaria</option>
                <option value="almoxarifado">Almoxarifado</option>
              </Form.Control>
            </Col>

            {this.state.infoPessoa !== null && (
              <Col sm={12} style={{ paddingTop: "10px" }}>
                <Header as="h2">Dados Cadastrais</Header>
                <Divider />
                <Segment.Group>
                  <Segment.Group horizontal>
                    <Segment>
                      <b>Tipo:</b> {this.state.infoPessoa.tipo}
                    </Segment>
                    <Segment>
                      <b>Telefone:</b> {this.state.infoPessoa.telefone}
                    </Segment>
                    <Segment>
                      <b>E-mail:</b> {this.state.infoPessoa.email}
                    </Segment>
                  </Segment.Group>
                  <Segment>
                    <b>Endereço:</b> {this.state.infoPessoa.endereco} -{" "}
                    {this.state.infoPessoa.bairro}, {this.state.infoPessoa.cep}{" "}
                    {this.state.infoPessoa.cidade}-
                    {this.state.infoPessoa.estado}
                  </Segment>
                </Segment.Group>
              </Col>
            )}

            {this.state.tipo_usuario === "dependente" && (
              <Col sm={12} style={{ paddingTop: "10px" }}>
                <Header as="h2">Titular</Header>
                <Divider />
                <Segment.Group>
                  <Segment.Group horizontal>
                    <Segment>
                      <Col sm={6}>
                        <Select
                          placeholder="Digite para buscar"
                          name="usuario"
                          onKeyDown={this.pesquisaUsuario}
                          inputId="pesquisaUsuario"
                          onChange={this.alteracaoSelectUsuario}
                          value={this.state.usuario}
                          options={this.state.listaUsuario}
                        />
                      </Col>
                    </Segment>
                  </Segment.Group>
                </Segment.Group>
              </Col>
            )}
            {this.state.tipo_usuario === "titular" && (
              <Col sm={12} style={{ paddingTop: "10px" }}>
                <Header as="h2">Ação/Titulo</Header>
                <Divider />
                {this.state.acao === null ? (
                  <Button
                    positive
                    icon="add"
                    size="tiny"
                    onClick={this.novaAcao}
                    type="button"
                  >
                    Nova Ação
                  </Button>
                ) : (
                    <Segment.Group>
                      <Segment.Group horizontal>
                        <Segment>
                          <b>Tipo Titulo:</b>
                          <Form.Control
                            placeholder="TipoTitulo"
                            label="TipoTitulo"
                            id="TipoTitulo"
                            as="select"
                            name="tipoTitulo"
                            onChange={this.alteraAcao}
                            checked={this.state.selectTipo}
                            required
                            disabled={this.state.efetuar_cobranca === false}
                          >
                            <option></option>
                            {this.state.listaTipoTitulo.map((e, i) =>
                              this.state.acao.tipo_titulo !== null &&
                                e.id === this.state.acao.tipo_titulo.id ? (
                                  <option key={i} value={e.id} selected>
                                    {e.descricao}
                                  </option>
                                ) : (
                                  <option key={i} value={e.id}>
                                    {e.descricao}
                                  </option>
                                )
                            )}
                          </Form.Control>
                        </Segment>
                        <Segment>
                          <b>Numero:</b> {this.state.acao.id} <br />
                          <br />
                          <b>Valor Mensalidade:</b>
                          {this.state.acao.tipo_titulo !== null &&
                            this.state.acao.tipo_titulo.valor_mensalidade}
                        </Segment>
                        <Segment>
                          <b>Data Emissão:</b>{" "}
                          {new Date(
                            this.state.acao.data_emissao
                          ).toLocaleDateString()}
                          <br />
                          <br />
                          <b>Valor Titulo:</b>
                          {this.state.acao.tipo_titulo !== null &&
                            this.state.acao.tipo_titulo.valor_titulo}
                        </Segment>
                      </Segment.Group>
                      {this.state.acao.tipo_titulo !== null &&
                        this.state.efetuar_cobranca === true && (
                          <Segment>
                            <Col sm={12} style={{ textAlign: "center" }}>
                              <Header as="h4">Cobrança:</Header>
                            </Col>
                            <Col sm={12}>
                              <Row>
                                <Col sm={4}>
                                  <Row>
                                    <Col sm={2}>
                                      <b>Titulo:</b>
                                    </Col>
                                    <Col sm={5}>
                                      <Form.Control
                                        as="select"
                                        name="tipo_pagamento"
                                        onChange={this.alteracao}
                                      >
                                        <option></option>
                                        <option value="1x">Á Vista</option>
                                        <option value="parcelado">
                                          Parcelado
                                      </option>
                                      </Form.Control>
                                    </Col>
                                    <Col sm={4}>
                                      <Form.Control
                                        hidden={
                                          this.state.tipo_pagamento !==
                                          "parcelado"
                                        }
                                        as="select"
                                        name="forma_pagamento_titulo"
                                        onChange={this.geraParcelas}
                                      >
                                        <option></option>
                                        {this.state.parcelas.map((e, i) => (
                                          <option key={i} value={e.value}>
                                            {e.label}
                                          </option>
                                        ))}
                                      </Form.Control>
                                    </Col>
                                    {this.state.infoParcelasTitulo.map((e, i) => {
                                      return (
                                        <Row>
                                          <Col key={i} sm={12}>
                                            <Row>
                                              <Col sm={5}>
                                                Parcela {e.numero}
                                                <Form.Control
                                                  value={e.valor}
                                                  id={"valorParcelaTitulo" + i}
                                                  onChange={
                                                    this.alteraValorParcelas
                                                  }
                                                  name="valorParcelaTitulo"
                                                ></Form.Control>
                                              </Col>
                                              <Col sm={6}>
                                                Vencimento
                                              <FormControl
                                                  type="date"
                                                  defaultValue={e.data_vencimento}
                                                  id={"dataVencimentoTitulo" + i}
                                                  onChange={
                                                    this
                                                      .alteraDataVencimentoParcelas
                                                  }
                                                ></FormControl>
                                              </Col>
                                            </Row>
                                          </Col>
                                        </Row>
                                      );
                                    })}
                                  </Row>
                                </Col>
                                <Col sm={8}>
                                  <Row>
                                    <Col sm={3}>
                                      <b>Mensalidade:</b>
                                    </Col>
                                    <Col sm={8}>
                                      <Form.Control
                                        placeholder="Tipo"
                                        as="select"
                                        name="forma_pagamento_mensalidade"
                                        onChange={this.geraParcelas}
                                      >
                                        <option></option>
                                        {this.state.parcelas.map((e, i) => (
                                          <option key={i} value={e.value}>
                                            {e.label}
                                          </option>
                                        ))}
                                      </Form.Control>
                                    </Col>
                                    {this.state.infoParcelasMensalidade.map(
                                      (e, i) => {
                                        return (
                                          <Row>
                                            <Col key={i} sm={12}>
                                              <Row>
                                                <Col sm={2}>
                                                  Parcela {e.numero}
                                                  <Form.Control
                                                    value={e.valor}
                                                    id={"valorParcela" + i}
                                                    onChange={
                                                      this.alteraValorParcelas
                                                    }
                                                    name="valorParcelaMensalidade"
                                                  ></Form.Control>
                                                </Col>
                                                <Col sm={3}>
                                                  Mês de referência
                                                <Form.Control
                                                    as="select"
                                                    name={"mesReferencia" + i}
                                                    onChange={
                                                      this.alteracaoMesReferencia
                                                    }
                                                    defaultValue={
                                                      this.state
                                                        .infoParcelasMensalidade[
                                                        i
                                                      ].mes_referencia
                                                    }
                                                  >
                                                    <option></option>
                                                    {this.state.meses.map(
                                                      (e, i) => (
                                                        <option
                                                          key={i}
                                                          value={e.value}
                                                        >
                                                          {e.label}
                                                        </option>
                                                      )
                                                    )}
                                                  </Form.Control>
                                                </Col>
                                                <Col sm={2}>
                                                  Ano
                                                <Form.Control
                                                    value={e.ano_referencia}
                                                    name={"anoReferencia" + i}
                                                    onChange={
                                                      this.alteracaoAnoReferencia
                                                    }
                                                  ></Form.Control>
                                                </Col>
                                                <Col sm={5}>
                                                  Vencimento
                                                <FormControl
                                                    type="date"
                                                    defaultValue={
                                                      e.data_vencimento
                                                    }
                                                    id={
                                                      "dataVencimentoMensalidade" +
                                                      i
                                                    }
                                                    onChange={
                                                      this
                                                        .alteraDataVencimentoParcelas
                                                    }
                                                    name="dataVencimentoParcelaMensalidade"
                                                  ></FormControl>
                                                </Col>
                                              </Row>
                                            </Col>
                                          </Row>
                                        );
                                      }
                                    )}
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                          </Segment>
                        )}
                    </Segment.Group>
                  )}
              </Col>
            )}
          </Row>
          <Divider />
          <Segment clearing>
            <Header floated="right">
              <Button type="button" onClick={this.voltar}>
                Voltar
              </Button>
              <Button negative type="button" onClick={this.excluir}>
                Deletar
              </Button>
              <Button positive type="submit">
                Salvar
              </Button>
            </Header>
          </Segment>
        </Form>
      </Container>
    );
  }
}
