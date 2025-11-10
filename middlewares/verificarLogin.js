// middlewares/verificarLogin.js
module.exports = (req, res, next) => {
  if (req.session && req.session.usuario) {
    next(); // usuário está logado
  } else {
    // guarda a rota que o usuário tentou acessar
    req.session.ultimaRota = req.originalUrl;
    res.redirect('/login');
  }
};
