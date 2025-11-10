const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Middleware de verificação de admin
function verificarAdmin(req, res, next) {
  if (req.session && req.session.autenticado) return next();
  res.redirect('/admin/seguranca');
}

// Página de login do admin
router.get('/seguranca', (req, res) => {
  res.render('admin/seguranca', { erro: null });
});

// Login do admin
router.post('/seguranca', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '1234') {
    req.session.autenticado = true;
    return res.redirect('/admin/painel');
  }
  res.status(401).render('admin/seguranca', { erro: 'Usuário ou senha inválidos' });
});

// Painel (carrega só o front, usuários via fetch)
router.get('/painel', verificarAdmin, (req, res) => {
  res.render('admin/painel'); 
});

// API para usuários (para fetch do front)
router.get('/usuarios', verificarAdmin, userController.listarUsuarios);
router.put('/usuarios/:id', verificarAdmin, userController.atualizarUsuario);
router.delete('/usuarios/:id', verificarAdmin, userController.deletarUsuario);

// Logout do admin
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Erro ao sair');
    res.redirect('/admin/seguranca');
  });
});

module.exports = router;
