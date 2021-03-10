
const corrigeTamanhoDoCampo = (valor, tamanho) => {
  if (valor.length > tamanho) {
    return valor.substring(0, tamanho).trim();
  } else {
    return valor;
  }
}


export default function (valor, tamanho) {
  valor = valor.toString();
  valor = corrigeTamanhoDoCampo(valor, tamanho);
  valor = valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  valor = valor.toUpperCase();
  valor = valor.padEnd(tamanho, ' ');
  return valor;
}