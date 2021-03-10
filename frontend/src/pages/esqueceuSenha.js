import React, { Component} from "react";
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
} from "semantic-ui-react";
import { Container } from "react-bootstrap";
import get from "lodash/get";
import { Formik } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import CircularProgress from '@material-ui/core/CircularProgress';

const defaultFormShape = {
  login: "",
};


class EsqueceuSenha extends Component {

  constructor(props) {

    super(props);
    this.state = {
      loginInvalido: false,
      firstRender: true,
      gerouSenha: false,
      problemaImprimir: false,
      clicouGerar: false,
      emailNaoCadastrado: false
    }
  }

  gerarSenha = async (values) => {
    this.setState({ clicouGerar: true });

    await api.post("/usuario/esqueceuSenha?e=public", {
      login: values.login,
    }).then(resposta => {
      this.setState({ gerouSenha: true });
      this.setState({ loginInvalido: false });
      this.setState({ clicouGerar: false})

    }).catch(e => {
      var a = e.message;
      if(a.includes("401")){
        this.setState({ loginInvalido: true });
      }
      if(a.includes("412")){
        this.setState({ emailNaoCadastrado: true });
      }
      if(a.includes("503")){
        this.setState({ problemaImprimir: true });
        this.setState({ loginInvalido: false });
      }
      this.setState({ clicouGerar: false });
    });
  };



  render() {



    const validationSchema = Yup.object().shape({
      login: Yup.string().required("Login é requerido!"),
    });

    return (
      <Formik
        initialValues={defaultFormShape}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values) => {
          this.gerarSenha(values);
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

                    <Container style={{fontSize: "20px", marginBottom:"16px",
                    fontWeight:"bold"}} >
                      Esqueci minha senha
                    </Container>

                    <Divider></Divider>

                    <Container style={{fontSize: "16px", marginTop:"20px"}} >
                      Digite seu login para gerar uma nova senha.
                    </Container>

                    <FormField style={{marginTop:"20px"}} >

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
                      {(get(touched, "login") && get(errors, "login")) && (
                        <Message negative size="mini">
                          {errors.login}
                        </Message>
                      )}
                      {this.state.loginInvalido && (
                        <Message negative size="mini">
                          Login Inválido.
                        </Message>
                      )}
                    </FormField>
                    {
                      this.state.gerouSenha &&
                      <Message positive>
                        Senha Gerada com sucesso!!!
                      </Message>
                    }
                    {
                      this.state.gerouSenha &&
                      <Container style={{fontSize: "16px", marginTop:"16px", marginBottom:"16px"}} >
                        Verifique seu email.
                      </Container>
                    }
                    {
                      this.state.problemaImprimir &&
                      <Message negative>
                        Problema ao enviar seu email.
                      </Message>
                    }
                    {
                      this.state.emailNaoCadastrado &&
                      <Message negative >
                        Nenhum email cadastrado. Impossível enviar email com a senha do usuário.
                      </Message>
                    }
                    {
                      this.state.clicouGerar &&
                      <Container style={{marginTop:"30px", marginBottom:"30px"}}>
                        <CircularProgress/>
                      </Container>
                    }
                    <Button fluid primary
                    type="submit" size="large" disabled={this.state.clicouGerar || this.state.gerouSenha}>
                      Gerar Senha
                    </Button>
                  </Segment>
                </Form>
              </Grid.Column>
            </Grid>
          )}
      />
    );
  }
}

export default EsqueceuSenha;
