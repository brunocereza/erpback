import React, { Component } from "react";
import {
  Grid,
  Header,
  Form,
  Button,
  FormField,
  Message,
  Segment,
  Input,
  Image,
  Divider,
  Modal,
  Container,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import get from "lodash/get";
import { Formik } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import InputMask from "react-input-mask";
import CircularProgress from "@material-ui/core/CircularProgress";

const defaultFormShape = {
  senha: "",
  login: "",
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openCadastrarUsuario: false,
      selectedOption: "",
      cpf_cnpj: "",
      cadastroNotFound: false,
      listaCadastros: [],
      listaCadastrosView: [],
      listaEntidadesView: [],
      opcao_cadastrar: "",
      nome_cadastro: "",
      login_cadastro: "",
      loginInvalido: false,
      problemaCadastro: false,
      sucessoCadastro: false,
      clicouCadastrar: false,
      tipoUsuarioInvalido: false,
      emailNaoCadastrado: false,
      errorMessage: "",
    };
  }
  efetuarLogin = async (values) => {
    await api
      .post("/usuario/autenticacao?e=public", {
        login: values.login,
        senha: values.senha,
      })
      .then(async (resposta) => {
        var localStorage = window.localStorage;
        localStorage.setItem("token", resposta.data.token);
        localStorage.setItem("entidade", resposta.data.usuario.entidade);
        localStorage.setItem(
          "tipo_usuario",
          resposta.data.usuario.tipo_usuario
        );
        localStorage.setItem(
          "tipo",
          resposta.data.tipo_cliente
        );
        if (resposta.data.usuario.tipo_usuario === "desenvolvimento") {
          window.location.href = "/entidade/lista";
        } else {
          window.location.reload();
        }
      })
      .catch((e) => {
        this.setState({ errorMessage: e.response.data.error });
        this.setState({ loginInvalido: true });
      });
  };

  buscaUserCpf_Cnpj = async (values) => {
    this.setState({
      listaCadastros: [],
      listaCadastrosView: [],
      emailNaoCadastrado: false,
    });
    if (this.state.cpf_cnpj === "") {
      this.setState({ cadastroNotFound: true });
      return;
    }

    // var localStorage = window.localStorage;

    var pessoas = [];
    await api
      .post("pessoa/buscaCpfCnpjTodasEntidade?e=public", {
        cpf_cnpj: this.state.cpf_cnpj,
      })
      .then((resposta) => {
        if (resposta.data.length === 0) {
          this.setState({ cadastroNotFound: true });
          return;
        }
        pessoas = resposta;
      })
      .catch((e) => {
        console.log("erro: ", e);
        this.setState({ loginInvalido: true });
        this.setState({ errorMessage: "" });
      });
    if (!pessoas.data) {
      this.setState({ cadastroNotFound: true });
      return;
    }

    this.setState({ nome_cadastro: pessoas.data.nome });

    for (let i = 0; i < pessoas.data.length; i++) {
      let tipoTitulo = "";
      const element = pessoas.data[i];

      //Por algum motivo, quando busca uma ação da base teste entra em loop.
      if (!pessoas.data[i].entidade.includes("teste")) {
        await api
          .post("/acao/visualiza?e=" + pessoas.data[i].entidade, {
            id: element.acao_id,
          })
          .then((resposta) => {
            tipoTitulo = resposta.data.tipo_titulo.descricao;
          })
          .catch((e) => {});
      }
      await api
        .post("/usuario/usuariosPorPessoa?e=public", {
          id: element.id,
          entidade: pessoas.data[i].entidade,
        })
        .then((resposta) => {
          let a = {
            entidade: pessoas.data[i].entidade,
            pessoa_id: element.id,
            nome: element.nome,
            cpf: element.cpf,
            email: element.email,
            tipoTitulo: tipoTitulo,
            usuarios: resposta.data,
          };
          let b = this.state.listaCadastros;
          b.push(a);
          this.setState({ listaCadastros: b });
        })
        .catch((e) => {
          this.setState({ loginInvalido: true });
          this.setState({ errorMessage: "" });
        });
    }

    var contEmail = 0;
    var listaCadastrosView = [];
    var listaEntidadesView = [];
    if (this.state.listaCadastros.length > 1) {
      listaEntidadesView.push(<option key={500} value=""></option>);
    }

    //Verificar se tem uma base que não é teste e uma que é teste, pelo menos.
    //Se tiver base teste e outra base, mostrar apenas os registros dessa outra base.
    let verificaBaseTeste = false;
    let verificaBaseNaoTeste = false;
    for (let i = 0; i < this.state.listaCadastros.length; i++) {
      const element = this.state.listaCadastros[i];
      if (element.entidade.includes("teste")) {
        verificaBaseTeste = true;
      } else {
        verificaBaseNaoTeste = true;
      }
    }

    var maxItens = 100;

    for (let i = 0; i < this.state.listaCadastros.length; i++) {
      const element = this.state.listaCadastros[i];

      if (this.state.listaCadastros.length === 1) {
        this.setState({ opcao_cadastrar: element.entidade });
      }
      if (
        verificaBaseTeste &&
        verificaBaseNaoTeste &&
        element.entidade.includes("teste")
      ) {
        continue;
      }
      if (
        element.email !== null &&
        element.email !== "" &&
        element.email.includes("@")
      ) {
        contEmail++;
        listaEntidadesView.push(
          <option key={maxItens * i + 4} value={element.entidade}>
            {element.nome}
          </option>
        );
      }

      listaCadastrosView.push(<Divider key={maxItens * i}></Divider>);
      listaCadastrosView.push(
        <h4 key={maxItens * i + 1}>Cliente cadastrado: {element.nome}</h4>
      );
      listaCadastrosView.push(
        <p key={maxItens * i + 2}>
          <strong>Email: </strong>
          {element.email}
        </p>
      );
      listaCadastrosView.push(
        <p key={maxItens * i + 3} style={{ margin: "0px", padding: "0px" }}>
          <strong>Logins: </strong>
        </p>
      );
      for (let j = 0; j < element.usuarios.length; j++) {
        const element2 = element.usuarios[j];

        listaCadastrosView.push(
          <li key={maxItens * i + 5 + j}>{element2.login}</li>
        );
      }
    }

    if (contEmail === 0) {
      this.setState({ emailNaoCadastrado: true });
    }

    listaCadastrosView.push(<Divider key={10000}></Divider>);

    this.setState({ listaCadastrosView: listaCadastrosView });
    this.setState({ listaEntidadesView: listaEntidadesView });
    this.setState({ login_cadastro: this.state.listaCadastros[0].cpf });
    this.setState({ nome_cadastro: this.state.listaCadastros[0].nome });
  };

  cadastrarUsuario = async (values) => {
    this.setState({ clicouCadastrar: true });

    var tipoTitulo = "";
    var pessoaId = 0;
    var entidade = this.state.opcao_cadastrar;
    for (let i = 0; i < this.state.listaCadastros.length; i++) {
      const element = this.state.listaCadastros[i];
      if (element.entidade === entidade) {
        tipoTitulo = element.tipoTitulo;
        pessoaId = element.pessoa_id;
      }
    }

    var tipoUsuario = "";

    if (
      tipoTitulo == "Patrimonial" ||
      tipoTitulo == "PATRIMONIAL" ||
      tipoTitulo == "Contribuinte" ||
      tipoTitulo == "CONTRIBUINTE" ||
      tipoTitulo == "CONTRIBUINTE COM DEPENDENTE" ||
      tipoTitulo == "CONTRIBUINTE SEM DEPENDENTES" ||
      tipoTitulo == "Temporario" ||
      tipoTitulo == "TEMPORÁRIO" ||
      tipoTitulo.toUpperCase() === "CONTRIBUINTE SEM DEPENDENTES"
    ) {
      tipoUsuario = "titular";
    } else if (tipoTitulo == "dependente" || tipoTitulo == "DEPENDENTE") {
      tipoUsuario = tipoTitulo;
    } else {
      tipoUsuario = "invalido";
    }
    if (tipoUsuario == "invalido") {
      this.setState({ tipoUsuarioInvalido: true });
      this.setState({ clicouCadastrar: false });
      return;
    }

    await api
      .post("/usuario/salvar?e=" + entidade, {
        nome: this.state.nome_cadastro,
        login: this.state.login_cadastro,
        tipo_usuario: tipoUsuario,
        pessoa_id: pessoaId,
      })
      .then((resposta) => {
        console.log("cadastrou o usuario");
      })
      .catch((e) => {
        this.setState({ loginInvalido: true });
        this.setState({ errorMessage: "" });
        this.setState({ clicouCadastrar: false });
      });
    if (this.state.loginInvalido) {
      return;
    }

    await api
      .post("/usuario/esqueceuSenha?e=public", {
        login: this.state.login_cadastro,
      })
      .then((resposta) => {
        this.setState({ sucessoCadastro: true });
      })
      .catch((e) => {
        var a = e.message;
        console.log(a);
        this.setState({ problemaCadastro: true });
      });
  };

  render() {
    const validationSchema = Yup.object().shape({
      login: Yup.string().required("Login é requerido!"),
      senha: Yup.string().required("Por favor digite a senha"),
    });
    return (
      <Formik
        initialValues={defaultFormShape}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values) => {
          this.efetuarLogin(values);
        }}
        render={({
          touched,
          errors,
          values,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <Grid
            textAlign="center"
            style={{ height: "100vh" }}
            verticalAlign="middle"
            container
          >
            <Grid.Column style={{ maxWidth: 450 }}>
              {/* <Image src={logoApp} fluid size="small" centered /> */}
              <Header as="h1" color="blue" textAlign="center"></Header>
              <Form
                onSubmit={handleSubmit}
                loading={this.props.loading}
                size="large"
              >
                <Segment raised>
                  <FormField>
                    <Input
                      placeholder="Login"
                      icon="user"
                      iconPosition="left"
                      fluid
                      name="login"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      values={values.email}
                    />
                    {get(touched, "login") && get(errors, "login") && (
                      <Message negative size="mini">
                        {errors.login}
                      </Message>
                    )}
                  </FormField>
                  <FormField>
                    <Input
                      placeholder="Senha"
                      icon="lock"
                      iconPosition="left"
                      fluid
                      type="password"
                      name="senha"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      values={values.senha}
                    />
                    {get(touched, "senha") && get(errors, "senha") && (
                      <Message negative size="mini">
                        {errors.senha}
                      </Message>
                    )}
                  </FormField>
                  {this.state.loginInvalido === true ? (
                    this.state.errorMessage !== "" ? (
                      <Message negative>{this.state.errorMessage}</Message>
                    ) : (
                      <Message negative>Login Inválido!</Message>
                    )
                  ) : null}
                  <Button fluid primary type="submit" size="large">
                    Login
                  </Button>

                  <FormField style={{ marginTop: "10px" }}>
                    <Link to={{ pathname: "/esqueceuSenha" }}>
                      Esqueceu a senha?
                    </Link>
                  </FormField>

                  <Divider />

                  <FormField style={{ marginTop: "25px" }}>
                    <Button
                      fluid
                      color="green"
                      type="button"
                      size="large"
                      onClick={() => {
                        this.setState({ openCadastrarUsuario: true });
                      }}
                    >
                      Cadastrar
                    </Button>
                  </FormField>
                </Segment>
              </Form>

              <Modal
                open={this.state.openCadastrarUsuario}
                onClose={() => {
                  this.setState({ openCadastrarUsuario: false });
                }}
                style={{ width: "40%" }}
              >
                <Header content="Cadastrar Usuário" />
                <Modal.Content>
                  <Form
                    onSubmit={this.buscaUserCpf_Cnpj}
                    style={{
                      width: "80%",
                      maxWidth: "600px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <h4>Digite o seu CPF:</h4>
                    <Row>
                      <Col>
                        <FormField>
                          <InputMask
                            placeholder="CPF"
                            name="cpf"
                            onBlur={handleBlur}
                            onChange={(event) => {
                              this.setState({
                                cpf_cnpj: event.target.value,
                                cadastroNotFound: false,
                              });
                            }}
                            values={this.state.cpf_cnpj}
                            mask="999.999.999-99"
                          />

                          {this.state.selectedOption === "juridica" ? (
                            <InputMask
                              placeholder="CNPJ"
                              name="cnpj"
                              onBlur={handleBlur}
                              onChange={(event) => {
                                this.setState({
                                  cpf_cnpj: event.target.value,
                                  cadastroNotFound: false,
                                });
                              }}
                              values={values.cnpj}
                              mask="99.999.999/9999-99"
                            />
                          ) : null}
                        </FormField>
                      </Col>
                      <Col>
                        <Button type="submit" fluid color="blue" size="large">
                          Buscar
                        </Button>
                      </Col>
                    </Row>
                    {this.state.cadastroNotFound === true ? ( //this.state.selectedOption !== "" &&
                      <Message negative>Cadastro não encontrado.</Message>
                    ) : null}
                  </Form>
                  {this.state.listaCadastros.length > 0 ? (
                    <Container
                      style={{
                        width: "80%",
                        maxWidth: "600px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        padding: "0",
                      }}
                    >
                      {this.state.listaCadastrosView}
                    </Container>
                  ) : null}

                  <Form
                    style={{
                      width: "80%",
                      marginLeft: "auto",
                      marginRight: "auto",
                      marginTop: "30px",
                      padding: "0",
                    }}
                    onSubmit={this.cadastrarUsuario}
                  >
                    {this.state.listaCadastros.length > 0 ? (
                      <Container style={{ padding: "0" }}>
                        <h4>Em qual Cliente você deseja se cadastrar?</h4>
                        <select
                          onChange={(event) => {
                            this.setState({
                              opcao_cadastrar: event.target.value,
                            });
                          }}
                          defaultValue={this.state.opcao_cadastrar}
                        >
                          {this.state.listaEntidadesView}
                        </select>
                        <Input
                          placeholder="Nome"
                          icon="user"
                          iconPosition="left"
                          fluid
                          name="nome"
                          onBlur={handleBlur}
                          disabled={true}
                          onChange={(event) => {
                            this.setState({
                              nome_cadastro: event.target.value,
                            });
                          }}
                          values={this.state.nome_cadastro}
                          defaultValue={this.state.nome_cadastro}
                          style={{ marginTop: "10px" }}
                        />
                        <Input
                          placeholder="Login"
                          icon="at"
                          iconPosition="left"
                          fluid
                          name="login"
                          onBlur={(event) => {
                            this.setState({
                              login_cadastro: event.target.value,
                            });
                          }}
                          onChange={(event) => {
                            this.setState({
                              login_cadastro: event.target.value,
                              loginInvalido: false,
                              tipoUsuarioInvalido: false,
                              emailNaoCadastrado: false,
                            });
                          }}
                          values={this.state.login_cadastro}
                          defaultValue={this.state.login_cadastro}
                          style={{ marginTop: "10px" }}
                        />
                        {this.state.loginInvalido === true ? (
                          <Message negative>Login já cadastrado!</Message>
                        ) : null}
                        {this.state.problemaCadastro === true ? (
                          <Message negative>
                            Problema ao gerar a senha do usuário.
                          </Message>
                        ) : null}
                        {this.state.sucessoCadastro === true ? (
                          <Message positive>
                            Cadastro efetuado com sucesso!
                          </Message>
                        ) : null}
                        {this.state.sucessoCadastro && (
                          <Container
                            style={{
                              fontSize: "16px",
                              marginTop: "16px",
                              marginBottom: "16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            Verifique seu email.
                          </Container>
                        )}
                        {this.state.tipoUsuarioInvalido && (
                          <Message negative>
                            Cadastro deste tipo de título não suportado. Entre
                            em contato com o setor administrativo.
                          </Message>
                        )}
                        {this.state.emailNaoCadastrado && (
                          <Message negative>
                            Nenhum email cadastrado. Impossível enviar email com
                            a senha do usuário.
                          </Message>
                        )}
                        {this.state.sucessoCadastro === false &&
                        this.state.loginInvalido === false &&
                        this.state.problemaCadastro === false &&
                        this.state.clicouCadastrar === true ? (
                          <Container
                            style={{
                              marginTop: "30px",
                              marginBottom: "30px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <CircularProgress />
                          </Container>
                        ) : null}
                        <Button
                          type="submit"
                          color="green"
                          fluid
                          size="large"
                          style={{ marginTop: "15px" }}
                          disabled={
                            this.state.opcao_cadastrar === "" ||
                            this.state.login_cadastro == "" ||
                            this.state.nome_cadastro == "" ||
                            this.state.clicouCadastrar ||
                            this.state.emailNaoCadastrado
                          }
                        >
                          Cadastrar
                        </Button>
                      </Container>
                    ) : null}
                  </Form>
                </Modal.Content>
              </Modal>
            </Grid.Column>
          </Grid>
        )}
      />
    );
  }
}

export default Login;
