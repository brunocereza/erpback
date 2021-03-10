export default {
  header: { headers: { token: "Baer " + window.localStorage.getItem("token") } },
  entidade: "?e=" + window.localStorage.getItem("entidade")
}
