import { parseISO } from 'date-fns';
import { zonedTimeToUtc } from "date-fns-tz";
import moment from 'moment';
export default function calculo(valor, moraDiaria, multa, dataVencimento) {
  valor = parseFloat(valor);
  let valorMora = 0;
  let valorMulta = 0;
  let dataHoje = zonedTimeToUtc(new Date(), "America/Sao_Paulo");
  dataVencimento = parseISO(dataVencimento);
  dataVencimento = moment(dataVencimento, 'DD-MM-YYYY');
  dataHoje = moment(dataHoje, 'DD-MM-YYYY');
  if (dataHoje.diff(dataVencimento, 'days') > 1) {
    const porcentagemMora = moraDiaria * parseInt(dataHoje.diff(dataVencimento, 'days'));
    valorMora = valor * parseFloat(porcentagemMora).toFixed(3) / 100;
    valorMulta = valor * multa / 100;
    const soma = valor + valorMora + valorMulta;
    return { total: soma.toFixed(2), mora: parseFloat(valorMora).toFixed(2), multa: parseFloat(valorMulta).toFixed(2) };
  } else {
    return { total: valor.toFixed(2), mora: parseFloat(valorMora).toFixed(2), multa: parseFloat(valorMulta).toFixed(2) };
  }
}