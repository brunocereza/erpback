import React, { Component } from "react";
import { Row, Col, Form, Alert } from "react-bootstrap";
import {
  Container,
  Header,
  Input,
  FormField,
  Button,
  Divider,
  Segment,
  Checkbox,
  Icon,
} from "semantic-ui-react";
import api from "../../../services/api";
import { Link } from "react-router-dom";
import requisicoes from "../../../utils/Requisicoes";
import InputMask from "react-input-mask";
import cep from "cep-promise";
import ibge from "../../../services/apiIbge";

export default class Entidade extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      descricao: null,
      nome: null,
      mensagem_entidade_ja_existe: false,
      nome: null,
      loading: false,
      selectedCheckboxes: [],
      tiposretorno: [],
      checkbox: false,
      ativo: null,
      estados: [],
      cidades: [],
      tipo: null,
      cnpj: null,
      telefone: null,
      email: null,
      cep: null,
      estado: null,
      cidade: null,
      numero: null,
      endereco: null,
      bairro: null,
    };
    this.buscaTiposTitulos();
    this.listaEstado();
    this.visualiza();
    this.alteracao = this.alteracao.bind(this);
  }

  visualiza = async () => {
    if (this.props.location.query !== undefined) {
      var localStorage = window.localStorage;
      var token = localStorage.getItem("token");
      var e = localStorage.getItem("entidade");
      const resposta = await api.post(
        "/entidade/visualiza?e=" + e,
        this.props.location.query,
        { headers: { token: "Baer " + token } }
      );
      this.setState(resposta.data);
      this.listaCidadesPorUF(resposta.data.uf);
    }
  };

  alteracao = (event) => {
    switch (event.target.name) {
      case "descricao":
        this.setState({
          descricao: event.target.value
            .replace(/[^\w\s]/gi, "")
            .trim()
            .toLowerCase(),
        });
        break;
      case "cidade":
        this.buscaCidadeSetaCidEst(event.target.value);
        break;
      default:
        this.setState({ [event.target.name]: event.target.value });
        break;
    }
  };

  buscaCep = async (event) => {
    await cep(event.target.value)
      .then(async (cep) => {
        await this.setState({ uf: cep.state });
        await this.listaCidadesPorUF(cep.state);
        await this.setState({ cidade: cep.city });
      })
      .catch((err) => {
        this.setState({ desabilitar_cidade_estado: false });
        alert("Cep não encontrado favor selecionar estado e cidade!");
      });
  };

  listaEstado = async () => {
    const retorno = await ibge.get("/localidades/estados");
    this.setState({ estados: retorno.data });
  };

  listaCidades = async (event) => {
    this.setState({ [event.target.name]: event.target.value });
    const retorno = await ibge.get(
      "/localidades/estados/" + event.target.value + "/municipios"
    );
    this.setState({ cidades: retorno.data });
  };

  listaCidadesPorUF = async (uf) => {
    const retorno = await ibge.get(
      "/localidades/estados/" + uf + "/municipios"
    );
    await this.setState({ cidades: retorno.data });
  };

  buscaCidadeSetaCidEst = async (codigo) => {
    const retorno = await ibge.get("/localidades/municipios/" + codigo);
    this.setState({ uf: retorno.data.microrregiao.mesorregiao.UF.sigla });
    this.setState({ cidade: retorno.data.nome });
  };

  handleSubmit = (event) => {
    this.submit();
    event.preventDefault();
  };

  toggleCheckbox = (e) => {
    if (this.state.selectedCheckboxes.has(e.target.value)) {
      this.state.selectedCheckboxes.delete(e.target.value);
    } else {
      this.state.selectedCheckboxes.add(e.target.value);
    }
  };

  submit = async () => {
    this.setState({ loading: true });
    const c = this.state;
    const dados = {
      id: c.id,
      descricao: c.descricao,
      nome: c.nome,
      ativo: c.ativo,
      tipo: c.tipo,
      cnpj: c.cnpj,
      telefone: c.telefone,
      email: c.email,
      cep: c.cep,
      uf: c.uf,
      cidade: c.cidade,
      numero: c.numero,
      endereco: c.endereco,
      bairro: c.bairro,
    };
    if (this.props.location.query === undefined) {
      await api
        .post(
          "/entidade/salvar?e=" + requisicoes.entidade,
          dados,
          requisicoes.header
        )
        .then(() => {
          window.location.href = "/entidade/lista";
        })
        .catch(() => {
          this.setState({ mensagem_entidade_ja_existe: true });
        });
    } else {
      await api
        .post(
          "/entidade/alterar?e=" + requisicoes.entidade,
          dados,
          requisicoes.header
        )
        .then((resp) => {
          window.location.href = "/entidade/lista";
        });
    }
  };

  buscaTiposTitulos = async () => {
    const tiposretorno = await api.post(
      "/tipoTitulo/lista" + requisicoes.entidade,
      {},
      requisicoes.header
    );
    this.setState({ tiposretorno: tiposretorno.data });
  };

  changeCheckTipo = (e, { value }) => this.setState({ tipo: value });

  onChangeCheckbox = (evt, data) => {
    this.setState({ ativo: data.checked });
  };

  render() {
    return (
      <Container className="pagina">
        <Header as="h1" dividing>
          Entidade
        </Header>
        <Alert
          variant="danger"
          hidden={this.state.mensagem_entidade_ja_existe === false}
        >
          Entidade já Existe
        </Alert>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col sm={5}>
              <Form.Label>Nome da entidade</Form.Label>
              <FormField
                placeholder="Nome do cliente"
                name="nome"
                control={Input}
                onChange={this.alteracao}
                required
                value={this.state.nome}
                fluid
                autoComplete="disabled"
              />
            </Col>
            <Col sm={2}>
              <Form.Label>Ativo/Inativo</Form.Label>
              <FormField>
                <Checkbox
                  toggle
                  onChange={this.onChangeCheckbox}
                  checked={this.state.ativo}
                />
              </FormField>
            </Col>
          </Row>
          <Row>
            <Col sm={5}>
              <Form.Label>Nome schema banco de dados</Form.Label>
              <FormField
                placeholder="Sem espaço, caracteres especiais ou Letras Maiúsculas"
                name="descricao"
                control={Input}
                onChange={this.alteracao}
                required
                value={this.state.descricao}
                fluid
                autoComplete="disabled"
              />
            </Col>
            <Col sm={5}>
              <Form.Label>Tipo:</Form.Label>
              <Row>
                {/* <Col sm={5}>
                  <Checkbox
                    toggle
                    label="Clube Social"
                    name="checkboxRadioGroup"
                    value="clube_social"
                    checked={this.state.tipo === "clube_social"}
                    onChange={this.changeCheckTipo}
                  />
                </Col>
                <Col sm={5}>
                  <Checkbox
                    toggle
                    label="Clube de tiro"
                    name="checkboxRadioGroup"
                    value="clube_tiro"
                    checked={this.state.tipo === "clube_tiro"}
                    onChange={this.changeCheckTipo}
                  />
                </Col> */}
              </Row>
            </Col>
          </Row>
          <Row>
            <Col sm={5}>
              <Form.Label>CNPJ</Form.Label>
              <InputMask
                mask="99.999.999/9999-99"
                className="form-control"
                placeholder="CNPJ"
                name="cnpj"
                onChange={this.alteracao}
                value={this.state.cnpj}
                required
                autoComplete="disabled"
              />
            </Col>
            <Col sm={2}>
              <Form.Label>Telefone</Form.Label>
              <InputMask
                mask="(99) 9999-9999"
                className="form-control"
                placeholder="telefone"
                name="telefone"
                onChange={this.alteracao}
                value={this.state.telefone}
                autoComplete="disabled"
              />
            </Col>
            <Col sm={5}>
              <Form.Label>E-mail</Form.Label>
              <FormField
                placeholder="E-Mail"
                name="email"
                control={Input}
                onChange={this.alteracao}
                value={this.state.email}
                fluid
                autoComplete="disabled"
              />
            </Col>
          </Row>
          <Row>
            <Col sm={2}>
              <Form.Label>CEP</Form.Label>
              <InputMask
                mask="99.999-999"
                className="form-control"
                placeholder="CEP"
                name="cep"
                onChange={this.alteracao}
                onBlur={this.buscaCep}
                value={this.state.cep}
                required
                autoComplete="disabled"
              />
            </Col>
            <Col sm={5}>
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                name="uf"
                checked={this.state.uf}
                onChange={this.listaCidades}
                id="uf"
                defaultValue={this.state.uf}
                required
                disabled={this.state.desabilitar_cidade_estado}
              >
                <option></option>
                {this.state.estados.map((e, i) =>
                  e.sigla === this.state.uf ? (
                    <option key={i} value={e.id} selected>
                      {e.nome}
                    </option>
                  ) : (
                    <option key={i} value={e.id}>
                      {e.nome}
                    </option>
                  )
                )}
              </Form.Control>
            </Col>

            <Col sm={5}>
              <Form.Label>Cidade</Form.Label>
              <Form.Control
                as="select"
                name="cidade"
                checked={this.state.estado}
                onChange={this.alteracao}
                defaultValue={this.state.cidade}
                required
                disabled={this.state.desabilitar_cidade_estado}
              >
                {}
                <option></option>
                {this.state.cidades.map((e, i) =>
                  e.nome === this.state.cidade ? (
                    <option key={i} value={e.id} selected>
                      {e.nome}
                    </option>
                  ) : (
                    <option key={i} value={e.id}>
                      {e.nome}
                    </option>
                  )
                )}
              </Form.Control>
            </Col>
          </Row>
          <Row>
            <Col sm={2}>
              <Form.Label>Número</Form.Label>
              <FormField
                placeholder="Número"
                name="numero"
                control={Input}
                onChange={this.alteracao}
                value={this.state.numero}
                fluid
                autoComplete="disabled"
              />
            </Col>
            <Col sm={5}>
              <Form.Label>Endereço</Form.Label>
              <FormField
                placeholder="Endereço"
                name="endereco"
                control={Input}
                onChange={this.alteracao}
                value={this.state.endereco}
                fluid
                autoComplete="disabled"
              />
            </Col>
            <Col sm={5}>
              <Form.Label>Bairro</Form.Label>
              <FormField
                placeholder="Bairro"
                name="bairro"
                control={Input}
                onChange={this.alteracao}
                value={this.state.bairro}
                fluid
                autoComplete="disabled"
              />
            </Col>
          </Row>
          <Divider />
          <Col sm={12} hidden>
            <Row>
              <Form.Label>Tipo de títulos</Form.Label>
            </Row>
            <Col sm={12}>
              <Row>
                {this.state.tiposretorno.map((element, index) => {
                  return (
                    <Col sm={4}>
                      <Checkbox
                        radio
                        key={index}
                        id={element.id}
                        label={element.descricao}
                        onChange={this.toggleCheckbox}
                      >
                        {" "}
                        {element.descricao}
                      </Checkbox>
                    </Col>
                  );
                })}
              </Row>
            </Col>
          </Col>

          <Segment clearing>
            <Header floated="right">
              <Link to="/entidade/lista">
                <Button type="button">Cancelar</Button>
              </Link>
              <Button positive type="submit" loading={this.state.loading}>
                Salvar
              </Button>
            </Header>
          </Segment>
        </Form>
      </Container>
    );
  }
}
