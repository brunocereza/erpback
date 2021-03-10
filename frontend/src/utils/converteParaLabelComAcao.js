import renomearChave from "../services/renomearChave";

export default (objetoLista) => {
  let lista = [];
  for (let i = 0; i < objetoLista.length; i++) {
    const element = objetoLista[i];
    var objeto = renomearChave(element, "id", "value");
    //objeto.label = renomearChave(objeto, "nome", "label").label;
    if(element.acao !== undefined && element.acao !== null){
      if(element.acao.codigo === null){
        objeto.label = "";
        if(element.acao.tipo_titulo !== null && element.acao.tipo_titulo.prefixo !== null){
          objeto.label += element.acao.tipo_titulo.prefixo  + " "
        }
        if(objeto.acao.codigo_auxiliar !== null){
          objeto.label += renomearChave(objeto.acao, "codigo_auxiliar", "label").label +
          " - ";
        }
        objeto.label += objeto.nome;
      } else {
        objeto.label =
        renomearChave(objeto.acao, "codigo", "label").label +
        " - " +
        objeto.nome;
      }
      if (element.titular_id !== null) {
        objeto.label += "    - Dependente";
      } else if (element.acao === undefined || element.acao === null) {
        objeto.label += "    - Sem ação";
      } else {
        objeto.label += "    - Titular";
      }
      lista.push(objeto);
    } else {
      objeto.label = objeto.nome;
      lista.push(objeto);
    }
  }
  return lista;
}