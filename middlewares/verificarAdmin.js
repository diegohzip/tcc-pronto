module.exports = (req, res, next) => {
  if (req.session && req.session.autenticado) {
    next(); // admin autenticado
  } else {
    res.redirect('/admin/seguranca');
  }
};
