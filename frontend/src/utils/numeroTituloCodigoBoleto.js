
export default function numeroTitulo(codigo) {
  switch (codigo.toString().substring(0, 3)) {
    case "136"://Unicred
      if (codigo.length === 47) {
        return codigo.toString().substring(19, 20) + codigo.toString().substring(22, 30);
      }
      if (codigo.length === 44) {
        return codigo.toString().substring(33, 43);
      }
      break;
    case "237"://Bradesco
      if (codigo.length === 47) {
        return codigo.toString().substring(11, 20) + codigo.toString().substring(21, 23);
      }
      if (codigo.length === 44) {
        return codigo.toString().substring(26, 36);
      }
      break;
    default:
      break;
  };
}