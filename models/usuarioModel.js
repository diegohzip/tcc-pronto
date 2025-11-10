const pool = require('../config/db');

class UsuarioModel {
  static async listarTodos() {
    const [rows] = await pool.query(
      "SELECT id, nome, email, telefone, genero FROM usuarios ORDER BY nome ASC"
    );
    return rows;
  }

  static async buscarPorId(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido.");
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE id = ?", [id]
    );
    return rows[0] || null;
  }

  static async buscarPorEmail(email) {
    if (!email) throw new Error("Email inválido.");
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?", [email]
    );
    return rows[0] || null;
  }

  static async buscarDuplicadosEmailTelefone(email, telefone) {
    if (!email || !telefone) throw new Error("Dados insuficientes para verificar duplicados.");
    const [rows] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ? OR telefone = ?", [email, telefone]
    );
    return rows;
  }

  static async buscarDuplicadosEmail(email, idAtual) {
    if (!email || !idAtual || isNaN(idAtual)) throw new Error("Dados inválidos para verificar duplicidade de email.");
    const [rows] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ? AND id != ?", [email, idAtual]
    );
    return rows;
  }

  static async criar({ nome, nascimento, email, telefone, genero, senha }) {
    if (!nome || !nascimento || !email || !telefone || !genero || !senha) throw new Error("Dados insuficientes para criar usuário.");
    const [resultado] = await pool.query(
      "INSERT INTO usuarios (nome, nascimento, email, telefone, genero, senha) VALUES (?, ?, ?, ?, ?, ?)",
      [nome, nascimento, email, telefone, genero, senha]
    );
    return resultado;
  }

  static async atualizar(id, nome, email, telefone, genero) {
    if (!id || isNaN(id) || !nome || !email || !telefone || !genero) throw new Error("Dados insuficientes ou inválidos para atualizar usuário.");
    const [resultado] = await pool.query(
      "UPDATE usuarios SET nome = ?, email = ?, telefone = ?, genero = ? WHERE id = ?",
      [nome, email, telefone, genero, id]
    );
    return resultado;
  }

  static async deletar(id) {
    if (!id || isNaN(id)) throw new Error("ID inválido para deletar usuário.");
    const [resultado] = await pool.query(
      "DELETE FROM usuarios WHERE id = ?", [id]
    );
    return resultado;
  }
}

module.exports = UsuarioModel;
