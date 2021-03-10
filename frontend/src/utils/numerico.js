//import ReplaceAll from 'replaceall';

const corrigeTamanhoDoCampo = (valor, tamanho) => {
  if (valor.length > tamanho) {
    return valor.substring(0, tamanho).trim();
  } else {
    return valor;
  }
}

export default function (valor, tamanho) {
  valor = valor.toString();
  valor = valor.replace("-", "");
  valor = valor.replace(".", "");
  //valor = parseInt(valor);
  valor = corrigeTamanhoDoCampo(valor, tamanho);
  valor = valor.toString();
  return valor.padStart(tamanho, '0');
}