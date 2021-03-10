import moment from "moment-timezone";

const metodo = (data) => {
  let dataVerificacao = moment(data).add(1, "day");
  let indiceProtecao = 0;
  while (
    dataVerificacao.day() === 6 ||
    dataVerificacao.day() === 0 ||
    indiceProtecao > 100
  ) {
    dataVerificacao = moment(dataVerificacao).add(1, "day");
    indiceProtecao++;
  }
  return dataVerificacao;
};

export default metodo;
