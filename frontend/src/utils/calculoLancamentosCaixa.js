export default function calculo(e, total) {
    if (e.credito_debito === "credito") {
        if (e.valor_pago !== null) {
          total = total + parseFloat(e.valor_pago);
        } else {
          total = total + parseFloat(e.valor);
        }
      } else {
        if (e.valor_pago !== null) {
          total = total - parseFloat(e.valor_pago);
        } else {
          total = total - parseFloat(e.valor);
        }
      }
      return total;
}