import React, { Component } from "react";
import {
  Grid,
  Header,
  Form,
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
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import "./styles.css";
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
      clube_opcao_cadastrar: "",
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
        console.log(resposta);
        var localStorage = window.localStorage;
        localStorage.setItem("token_clube", resposta.data.token);
        localStorage.setItem("e_clube", resposta.data.usuario.entidade);
        localStorage.setItem(
          "tipo_usuario_clube",
          resposta.data.usuario.tipo_usuario
        );
        localStorage.setItem("tipo_clube", resposta.data.tipo_clube);
        if (resposta.data.usuario.tipo_usuario === "administradorSistema") {
          window.location.href = "/entidade/lista";
        } else {
          window.location.reload();
        }
      })
      // .catch((e) => {
      //   this.setState({ errorMessage: e.response.data.error });
      //   this.setState({ loginInvalido: true });
      // });
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
    // var entidade = localStorage.getItem("e_clube");
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
            nomeClube: pessoas.data[i].nomeClube,
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
        this.setState({ clube_opcao_cadastrar: element.entidade });
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
            {element.nomeClube}
          </option>
        );
      }

      listaCadastrosView.push(<Divider key={maxItens * i}></Divider>);
      listaCadastrosView.push(
        <h4 key={maxItens * i + 1}>Clube cadastrado: {element.nomeClube}</h4>
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
    var entidade = this.state.clube_opcao_cadastrar;
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
          <div className="login">
            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column>
                  <Segment column className="login-inputright">
                    <Form
                      onSubmit={handleSubmit}
                      loading={this.props.loading}
                      size="large"
                    >
                      <div className="login-left">
                        <h1 className="title"> BEM VINDO !</h1>
                        <div className="login-user">
                          <input
                            placeholder="Login"
                            icon="user"
                            iconPosition="left"
                            fluid
                            name="login"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            values={values.email}
                          />
                        </div>
                        <div className="login-senha">
                          <input
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
                        </div>
                        <div className="buttonlogin">
                          {this.state.loginInvalido === true ? (
                            this.state.errorMessage !== "" ? (
                              <Message negative>
                                {this.state.errorMessage}
                              </Message>
                            ) : (
                              <Message negative>Login Inválido!</Message>
                            )
                          ) : null}
                          <Button
                            style={{ outline: "none" }}
                            color="primary"
                            type="submit"
                            size="large"
                          >
                            Login
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </Segment>
                </Grid.Column>

                <Grid.Column>
                  <Segment column className="login-inputleft">
                    <Form></Form>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        )}
      />
    );
  }
}

export default Login;
