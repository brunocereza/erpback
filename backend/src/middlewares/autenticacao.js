const jwt = require('jsonwebtoken');
const authConfig = require("../config/auth.json");

module.exports = (req, res, next) => {
  if(req.url !== "/usuario/autenticacao") {
    let authHeader = '';
    if (!req.headers.token) {
      authHeader = req.query.t;
    } else {
      authHeader = req.headers.token;
    }
    if (!authHeader)
        return res.status(401).send({ error: 'token não informado' });

      const parts = authHeader.split(' ');

      if (!parts.length === 2)
        return res.status(401).send({ error: 'Erro token' });

      const [scheme, authorization] = parts;

      if (!/^Baer$/i.test(scheme))
        return res.status(401).send({ error: 'Token mal formatado' });

      jwt.verify(authorization, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token Inválido' });

        req.userId = decoded.id;
        req.schema = decoded.schema;
        return next();
      });
  }else{
    return next();
  }
};
