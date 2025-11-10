const bcrypt = require('bcrypt');
const UsuarioModel = require('../models/usuarioModel');

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ==============================
// Cadastro de usuário
// ==============================
const cadastrar = async (req, res) => {
  try {
    const { nome, nascimento, email, telefone, genero, senha } = req.body;

    if (!nome || !nascimento || !email || !telefone || !genero || !senha) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }

    if (!validarEmail(email)) {
      return res.status(400).json({ erro: 'Email inválido.' });
    }

    const duplicados = await UsuarioModel.buscarDuplicadosEmailTelefone(email, telefone);
    if (duplicados && duplicados.length > 0) {
      return res.status(409).json({ erro: 'Email ou telefone já cadastrados.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = await UsuarioModel.criar({
      nome,
      nascimento,
      email,
      telefone,
      genero,
      senha: senhaHash
    });

    const userId = novoUsuario.insertId || novoUsuario.id || null;

    req.session.usuario = { id: userId, nome, email, nascimento, telefone, genero };

    // Redireciona para a última rota, se houver
    const destino = req.session.ultimaRota || '/';
    delete req.session.ultimaRota;

    return res.status(201).json({
      sucesso: 'Cadastro realizado com sucesso.',
      usuario: req.session.usuario,
      redirectTo: destino
    });

  } catch (err) {
    console.error('Erro no cadastro:', err);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
};

// ==============================
// Login de usuário
// ==============================
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
    }

    const usuario = await UsuarioModel.buscarPorEmail(email);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha incorreta.' });
    }

    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      nascimento: usuario.nascimento,
      telefone: usuario.telefone,
      genero: usuario.genero
    };

    // Redireciona para a última rota, se houver
    const destino = req.session.ultimaRota || '/';
    delete req.session.ultimaRota;

    return res.json({
      sucesso: 'Login realizado com sucesso!',
      redirectTo: destino
    });

  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ erro: 'Erro interno no login.' });
  }
};

// ==============================
// Logout
// ==============================
const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao destruir sessão:', err);
      return res.status(500).json({ erro: 'Erro ao sair.' });
    }
    res.clearCookie('connect.sid', { path: '/' });
    return res.redirect('/login');
  });
};

// ==============================
// Outras funções
// ==============================
const perfil = async (req, res) => {
  if (!req.session?.usuario) return res.status(401).json({ erro: 'Não autenticado.' });
  return res.json({ usuario: req.session.usuario, fichas: [] });
};

const atualizarDados = async (req, res) => {
  try {
    const usuarioSessao = req.session.usuario;
    if (!usuarioSessao) return res.status(401).json({ erro: 'Não autenticado.' });

    const { nome, email, telefone, genero } = req.body;
    if (!nome || !email || !telefone || !genero) return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    if (!validarEmail(email)) return res.status(400).json({ erro: 'Email inválido.' });

    const duplicado = await UsuarioModel.buscarDuplicadosEmail(email, usuarioSessao.id);
    if (duplicado && duplicado.length > 0) return res.status(409).json({ erro: 'Email já em uso por outro usuário.' });

    await UsuarioModel.atualizar(usuarioSessao.id, nome, email, telefone, genero);
    req.session.usuario = { ...usuarioSessao, nome, email, telefone, genero };

    return res.json({ sucesso: 'Dados atualizados com sucesso.', usuario: req.session.usuario });
  } catch (err) {
    console.error('Erro ao atualizar dados:', err);
    return res.status(500).json({ erro: 'Erro interno ao atualizar dados.' });
  }
};

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await UsuarioModel.listarTodos();
    return res.json(usuarios);
  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    return res.status(500).json({ erro: 'Erro ao buscar usuários.' });
  }
};

const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, genero } = req.body;

    if (!nome || !email || !telefone || !genero || !validarEmail(email)) return res.status(400).json({ erro: 'Dados inválidos.' });

    const duplicado = await UsuarioModel.buscarDuplicadosEmail(email, id);
    if (duplicado && duplicado.length > 0) return res.status(409).json({ erro: 'Email já em uso.' });

    await UsuarioModel.atualizar(id, nome, email, telefone, genero);
    return res.json({ sucesso: 'Usuário atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar usuário (admin):', err);
    return res.status(500).json({ erro: 'Erro interno ao atualizar usuário.' });
  }
};

const deletarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await UsuarioModel.deletar(id);
    return res.json({ sucesso: 'Usuário deletado com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar usuário (admin):', err);
    return res.status(500).json({ erro: 'Erro interno ao deletar usuário.' });
  }
};

const perfilJson = async (req, res) => {
  if (!req.session?.usuario) return res.status(401).json({ erro: 'Não autenticado.' });
  return res.json({ usuario: req.session.usuario, fichas: [] });
};

module.exports = {
  cadastrar,
  login,
  logout,
  perfil,
  atualizarDados,
  listarUsuarios,
  atualizarUsuario,
  deletarUsuario,
  perfilJson
};
