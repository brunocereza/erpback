import React, { Component } from "react";
import {
  Container,
  Table,
  Button,
  Menu,
  Icon,
  Header,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import api from "../../../services/api";
import requisicoes from "../../../utils/Requisicoes";

const tiposUsuario = [
  { value: "titular", label: "Titular" },
  { value: "dependente", label: "Dependente" },
  { value: "administrador", label: "Administrador" },
  { value: "temporario", label: "Temporário" },
  { value: "funcionario", label: "Funcionario" },
  { value: "caixa", label: "Caixa" },
  { value: "medico", label: "Médico" },
  { value: "portaria", label: "Portaria" },
  { value: "almoxarifado", label: "Almoxarifado" },
];

export default class UsuarioLista extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listaUsuario: [],
      pagina: 1,
      totalPaginas: 1,
      porTipoUsuario: false,
      tipoUsuario: null,
    };
    this.listaUsuario();
  }

  listaUsuario = async (page = 1) => {
    const resposta = await api.post(
      "/usuario/lista" + requisicoes.entidade + "&pagina=" + page,
      "",
      requisicoes.header
    );
    const { usuarios, pagina, totalPaginas } = resposta.data;
    this.setState({ listaUsuario: usuarios, pagina, totalPaginas });
  };

  pesquisaUsuario = async () => {
    setTimeout(async () => {
      const retorno = await api.post(
        "/usuario/pesquisa" + requisicoes.entidade,
        { pesquisa: document.getElementById("pesquisaUsuario").value },
        requisicoes.header
      );
      this.setState({ listaUsuario: retorno.data });
    }, 500);
  };

  pesquisaPorTipoUsuario = async (e, page = 1) => {
    this.setState({ tipoUsuario: e.value });

    setTimeout(async () => {
      this.setState({ porTipoUsuario: true });
      const retorno = await api.post(
        "/usuario/buscaPorTipoUsuario" + requisicoes.entidade + "&pagina=" + page,
        {
          tipo_usuario: this.state.tipoUsuario,
          entidade: window.localStorage.getItem("entidade"),
        },
        requisicoes.header
      );
      const { usuarios, pagina, totalPaginas } = retorno.data;
      this.setState({ listaUsuario: usuarios, pagina, totalPaginas });
    }, 500);
  };

  proximaPagina = async () => {
    const { pagina, totalPaginas } = this.state;
    if (pagina >= totalPaginas) return;
    const paginaNumero = parseInt(pagina) + 1;
    this.listaUsuario(paginaNumero);
  };

  voltarPagina = async () => {
    const { pagina } = this.state;
    if (pagina <= 1) return;
    const paginaNumero = pagina - 1;
    this.listaUsuario(paginaNumero);
  };

  proximaPaginaTipo = async () => {
    const tipo_usuario = { value: this.state.tipoUsuario };
    const { pagina, totalPaginas } = this.state;
    if (pagina >= totalPaginas) return;
    const paginaNumero = parseInt(pagina) + 1;
    this.pesquisaPorTipoUsuario(tipo_usuario, paginaNumero);
  };

  voltarPaginaTipo = async () => {
    const tipo_usuario = { value: this.state.tipoUsuario };
    const { pagina } = this.state;
    if (pagina <= 1) return;
    const paginaNumero = pagina - 1;
    this.pesquisaPorTipoUsuario(tipo_usuario, paginaNumero);
  };

  render() {
    return (
      <Container className="pagina">
        <Header as="h1" dividing>
          Usuario
        </Header>
        <Row>
          <Col sm={6}>
            <Select
              placeholder="Digite para buscar"
              name="pessoa"
              onKeyDown={this.pesquisaUsuario}
              inputId="pesquisaUsuario"
            />
          </Col>
          <Col sm={6}>
            <Select
              placeholder="Perfil"
              name="tipo_usuario"
              onChange={(e) => this.pesquisaPorTipoUsuario(e, 1)}
              options={tiposUsuario}
            />
          </Col>
        </Row>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Nome</Table.HeaderCell>
              <Table.HeaderCell>Login</Table.HeaderCell>
              <Table.HeaderCell>Perfil</Table.HeaderCell>
              <Table.HeaderCell width={1}>
                <Link to={{ pathname: "/usuario" }}>
                  <Button positive icon="add" size="tiny"></Button>
                </Link>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.listaUsuario.map((e, i) => (
              <Table.Row key={i}>
                <Table.Cell>{e.nome}</Table.Cell>
                <Table.Cell>{e.login}</Table.Cell>
                <Table.Cell>{e.tipo_usuario}</Table.Cell>
                <Table.Cell width={1}>
                  <Link to={{ pathname: "/usuario", query: { id: e.id } }}>
                    <Button primary icon="edit" size="tiny"></Button>
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>

          {this.state.porTipoUsuario === false ? (
            <Table.Footer>
              <Table.Row verticalAlign="middle" textAlign="center">
                <Table.HeaderCell colSpan={4}>
                  <Menu pagination>
                    <Menu.Item
                      icon
                      onClick={this.voltarPagina}
                      disabled={parseInt(this.state.pagina) === 1}
                    >
                      <Icon name="chevron left" />
                    </Menu.Item>
                    <Menu.Item
                      icon
                      onClick={this.proximaPagina}
                      disabled={
                        parseInt(this.state.pagina) ===
                        parseInt(this.state.totalPaginas)
                      }
                    >
                      <Icon name="chevron right" />
                    </Menu.Item>
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          ) : (
              <Table.Footer>
                <Table.Row verticalAlign="middle" textAlign="center">
                  <Table.HeaderCell colSpan={4}>
                    <Menu pagination>
                      <Menu.Item
                        icon
                        onClick={this.voltarPaginaTipo}
                        disabled={parseInt(this.state.pagina) === 1}
                      >
                        <Icon name="chevron left" />
                      </Menu.Item>
                      <Menu.Item
                        icon
                        onClick={this.proximaPaginaTipo}
                        disabled={
                          parseInt(this.state.pagina) ===
                          parseInt(this.state.totalPaginas)
                        }
                      >
                        <Icon name="chevron right" />
                      </Menu.Item>
                    </Menu>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            )}
        </Table>
      </Container>
    );
  }
}
