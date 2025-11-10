const express = require('express');
const router = express.Router();

// Importar controller e middleware
const userController = require('../controllers/userController');
const verificarLogin = require('../middlewares/verificarLogin');

// Rota principal
router.get('/', (req, res) => {
  res.render('index', { usuario: req.session.usuario || null });
});

// Login
router.get('/login', (req, res) => {
  res.render('login', {
    erro: null,
    ultimaRota: req.session.ultimaRota || '/'
  });
});

// Perguntas (página pública)
router.get('/perguntas', (req, res) => {
  res.render('perguntas', { usuario: req.session.usuario || null });
});

// Questionário (somente usuários logados)
router.get('/questionario', verificarLogin, (req, res) => {
  res.render('questionario', { usuario: req.session.usuario });
});

// Admin - tela de segurança
router.get('/admin/seguranca', (req, res) => {
  res.render('admin/seguranca');
});

// Admin - painel (somente se autenticado)
router.get('/admin/painel', (req, res) => {
  if (req.session.autenticado) {
    res.render('admin/painel');
  } else {
    res.redirect('/admin/seguranca');
  }
});

// Exportar rotas
module.exports = router;
