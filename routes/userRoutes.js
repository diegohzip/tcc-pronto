// routes/userRoutes.js
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const verificarLogin = require('../middlewares/verificarLogin');
// const verificarAdmin = require('../middlewares/verificarAdmin'); // Se precisar proteger rotas admin

// -------------------
// Rotas públicas
// -------------------
router.post('/cadastrar', userController.cadastrar);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

// -------------------
// Rotas do usuário logado (AJAX / fetch)
// -------------------
router.get('/perfil', verificarLogin, userController.perfil);
router.put('/atualizar', verificarLogin, userController.atualizarDados);  // Corrigido: removido '/usuario/' para evitar duplicação
router.get('/perfil-json', verificarLogin, userController.perfilJson);  // Corrigido: removido '/usuario/' para evitar duplicação

// -------------------
// Rotas administrativas
// -------------------
// Se quiser proteger com middleware admin, adicione verificarAdmin como segundo argumento
router.get('/usuarios', /*verificarAdmin,*/ userController.listarUsuarios);
router.put('/usuarios/:id', /*verificarAdmin,*/ userController.atualizarUsuario);
router.delete('/usuarios/:id', /*verificarAdmin,*/ userController.deletarUsuario);

module.exports = router;