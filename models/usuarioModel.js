// models/usuarioModel.js
const pool = require('../config/db');

class UsuarioModel {
  // ========================
  // Listar todos os usuários
  // ========================
  static async listarTodos() {
    try {
      const [rows] = await pool.query(
        "SELECT id, nome, email, telefone, genero FROM usuarios ORDER BY nome ASC"
      );
      return rows;
    } catch (err) {
      console.error("Erro ao listar usuários:", err);
      throw err;
    }
  }

  // ========================
  // Buscar por ID
  // ========================
  static async buscarPorId(id) {
    try {
      if (!id || isNaN(id)) throw new Error("ID inválido.");
      const [rows] = await pool.query(
        "SELECT id, nome, email, telefone, genero, senha, nascimento FROM usuarios WHERE id = ?",
        [id]
      );
      return rows[0] || null;
    } catch (err) {
      console.error("Erro ao buscar usuário por ID:", err);
      throw err;
    }
  }

  // ========================
  // Buscar por Email
  // ========================
  static async buscarPorEmail(email) {
    try {
      if (!email) throw new Error("Email inválido.");
      const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
      return rows[0] || null;
    } catch (err) {
      console.error("Erro ao buscar usuário por email:", err);
      throw err;
    }
  }

  // ========================
  // 🔥 Nova função — verifica duplicidade apenas de email e telefone
  // ========================
  static async buscarDuplicadosEmailTelefone(email, telefone) {
    try {
      if (!email || !telefone)
        throw new Error("Dados insuficientes para verificar duplicados.");
      const [rows] = await pool.query(
        "SELECT id FROM usuarios WHERE email = ? OR telefone = ?",
        [email, telefone]
      );
      return rows;
    } catch (err) {
      console.error("Erro ao buscar duplicados de email/telefone:", err);
      throw err;
    }
  }

  // ========================
  // Verifica duplicidade de email (usado na edição)
  // ========================
  static async buscarDuplicadosEmail(email, idAtual) {
    try {
      if (!email || !idAtual || isNaN(idAtual))
        throw new Error("Dados inválidos para verificar duplicidade de email.");
      const [rows] = await pool.query(
        "SELECT id FROM usuarios WHERE email = ? AND id != ?",
        [email, idAtual]
      );
      return rows;
    } catch (err) {
      console.error("Erro ao verificar duplicidade de email:", err);
      throw err;
    }
  }

  // ========================
  // Criar novo usuário
  // ========================
  static async criar({ nome, nascimento, email, telefone, genero, senha }) {
    try {
      if (!nome || !nascimento || !email || !telefone || !genero || !senha)
        throw new Error("Dados insuficientes para criar usuário.");
      const [resultado] = await pool.query(
        "INSERT INTO usuarios (nome, nascimento, email, telefone, genero, senha) VALUES (?, ?, ?, ?, ?, ?)",
        [nome, nascimento, email, telefone, genero, senha]
      );
      return resultado;
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      throw err;
    }
  }

  // ========================
  // Atualizar usuário
  // ========================
  static async atualizar(id, nome, email, telefone, genero) {
    try {
      if (!id || isNaN(id) || !nome || !email || !telefone || !genero)
        throw new Error("Dados insuficientes ou inválidos para atualizar usuário.");
      const [resultado] = await pool.query(
        "UPDATE usuarios SET nome = ?, email = ?, telefone = ?, genero = ? WHERE id = ?",
        [nome, email, telefone, genero, id]
      );
      return resultado;
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      throw err;
    }
  }

  // ========================
  // Deletar usuário
  // ========================
  static async deletar(id) {
    try {
      if (!id || isNaN(id)) throw new Error("ID inválido para deletar usuário.");
      const [resultado] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
      return resultado;
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      throw err;
    }
  }
}

module.exports = UsuarioModel;
