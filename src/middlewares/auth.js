const jwt = require("jsonwebtoken");
const env = require("../bin/env");

const authUser = (req, res, next) => {
  try {
    // Renovar el token si es necesario
    if (req.headers.authorization != "undefined") {
      try {
        console.log("Token Renewed", req.headers.authorization);

        const tokenDecoded = jwt.verify(req.headers.authorization, env.jwt.secret);
        
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const expirationTimestamp = tokenDecoded.exp;
        const fiveMinutesBeforeExpiration = expirationTimestamp - 300;
        

        if (currentTimestamp >= fiveMinutesBeforeExpiration) {
          // Generar un nuevo token y enviarlo en la respuesta
          const newToken = jwt.sign({ username: tokenDecoded.username }, env.jwt.secret, { expiresIn: env.jwt.exp });
          res.setHeader('Authorization', newToken);

        }
      } catch (err) {

        if(err.name === 'TokenExpiredError') {
          res.status(401).send({message: "El token ha expirado"})
        }
        
        res.status(401).send({message: "El token no es valido"})
        console.error(err);
      }
    }

    // Continuar con la verificación del token
    if (req.headers.authorization) {
      let tokenDecoded;
      try {
        tokenDecoded = jwt.verify(req.headers.authorization, env.jwt.secret);
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          res.status(403).send({
            message: "El token ha expirado"
          });
          return;
        } else {
          throw err;
        }
      }

      console.log("New Token", req.headers.authorization);

      if (tokenDecoded) {
        req.headers.authorization = tokenDecoded;
        console.log(tokenDecoded);
        next();
      } else {
        res.status(403).send({
          message: "Es un token inválido"
        });
      }
    } else {
      res.status(403).send({
        message: "Para realizar esta acción se necesita un token"
      });
    }
  } catch (e) {
    res.status(500).send({
      message: "Hubo un error inesperado al procesar el token"
    });
  }
};

module.exports = authUser;