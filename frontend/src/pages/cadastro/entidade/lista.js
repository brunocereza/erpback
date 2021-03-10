import React, { Component } from "react";
import {
  Container,
  Table,
  Button,
  Menu,
  Icon,
  Header,
  Tab,
} from "semantic-ui-react";
import { Col, Row } from "react-bootstrap";
import api from "../../../services/api";
import { Link } from "react-router-dom";
import Select from "react-select";
import requisicoes from "../../../utils/requisicoes";

export default class EntidadeLista extends Component {
  constructor(props) {
    super(props);
    this.state = { lista: [] };
    this.lista();
    console.log(props);
  }

  lista = async () => {
    const resposta = await api.post(
      "/entidade/lista" + requisicoes.entidade,
      "",
      requisicoes.header
    );
    this.setState({ lista: resposta.data });
  };

  render() {
    const panes = [
      {
        menuItem: "Entidades",
        render: () => (
          <Tab.Pane active style={{ padding: "0", borderColor: "transparent" }}>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Descrição</Table.HeaderCell>
                  <Table.HeaderCell width={1}>Ativo</Table.HeaderCell>
                  <Table.HeaderCell width={1}>
                    <Link to={{ pathname: "/entidade" }}>
                      <Button positive icon="add" size="tiny"></Button>
                    </Link>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {this.state.lista.map(
                  (e, i) =>
                    e.descricao !== "public" && (
                      <Table.Row key={i}>
                        <Table.Cell>{e.nome}</Table.Cell>
                        <Table.Cell>
                          {e.ativo === true ? (
                            <Button positive style={{ width: "100%" }}>
                              Ativo
                            </Button>
                          ) : (
                            <Button negative style={{ width: "100%" }}>
                              Inativo
                            </Button>
                          )}
                        </Table.Cell>
                        <Table.Cell width={1}>
                          <Link
                            to={{
                              pathname: "/entidade",
                              query: { id: e.id },
                            }}
                          >
                            <Button primary icon="edit" size="tiny"></Button>
                          </Link>
                        </Table.Cell>
                      </Table.Row>
                    )
                )}
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan="3">
                    <Menu floated="right" pagination>
                      <Menu.Item as="a" icon>
                        <Icon name="chevron left" />
                      </Menu.Item>
                      <Menu.Item as="a">1</Menu.Item>
                      <Menu.Item as="a">2</Menu.Item>
                      <Menu.Item as="a">3</Menu.Item>
                      <Menu.Item as="a">4</Menu.Item>
                      <Menu.Item as="a" icon>
                        <Icon name="chevron right" />
                      </Menu.Item>
                    </Menu>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Usuários ativos",
        render: () => (
          <Tab.Pane style={{ padding: "0", borderColor: "transparent" }}>
            <Table striped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Nome</Table.HeaderCell>
                  <Table.HeaderCell>Entidade</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Desconectar</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>John Lilki</Table.Cell>
                  <Table.Cell>September 14, 2013</Table.Cell>
                  <Table.Cell>jhlilk22@yahoo.com</Table.Cell>
                  <Table.Cell>No</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Tab.Pane>
        ),
      },
    ];
    return (
      <Container className="pagina">
        <Header as="h1" dividing>
          Dashborad
        </Header>
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </Container>
    );
  }
}
