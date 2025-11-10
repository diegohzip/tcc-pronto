document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("popupPerfil");
  const btnEditar = document.getElementById("btnEditar");
  const btnSalvar = document.getElementById("btnSalvar");
  const fecharPopup = document.getElementById("fecharPopupPerfil");

  const inputNome = document.getElementById("nomeUsuario");
  const inputEmail = document.getElementById("emailUsuario");
  const inputTelefone = document.getElementById("telefoneUsuario");
  const inputGenero = document.getElementById("generoUsuario");

  // Função para abrir o popup e preencher os campos
  function abrirPopup(usuario) {
    inputNome.value = usuario.nome || "";
    inputEmail.value = usuario.email || "";
    inputTelefone.value = usuario.telefone || "";
    inputGenero.value = usuario.genero || "";

    // Campos começam desabilitados
    inputNome.disabled = true;
    inputEmail.disabled = true;
    inputTelefone.disabled = true;
    inputGenero.disabled = true;

    btnSalvar.style.display = "none";
    btnEditar.style.display = "inline-block";

    popup.style.display = "flex";
  }

  // Botão fechar
  fecharPopup.addEventListener("click", () => {
    popup.style.display = "none";
  });

  // Botão editar
  btnEditar.addEventListener("click", () => {
    inputNome.disabled = false;
    inputEmail.disabled = false;
    inputTelefone.disabled = false;
    inputGenero.disabled = false;

    btnSalvar.style.display = "inline-block";
    btnEditar.style.display = "none";
  });

  // Botão salvar
  btnSalvar.addEventListener("click", async (e) => {
    e.preventDefault();

    const dadosAtualizados = {
      nome: inputNome.value.trim(),
      email: inputEmail.value.trim(),
      telefone: inputTelefone.value.trim(),
      genero: inputGenero.value.trim().toLowerCase(), // para padronizar no banco
    };

    try {
      const res = await fetch("/usuario/atualizar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAtualizados),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.erro || "Erro ao atualizar usuário");

      alert(json.sucesso);
      popup.style.display = "none";
      // Opcional: atualizar dados na tela principal
    } catch (err) {
      alert(err.message);
    }
  });

  // Exemplo de função para abrir o popup com dados do usuário da sessão
  async function carregarUsuarioSessao() {
    try {
      const res = await fetch("/perfil");
      if (!res.ok) throw new Error("Erro ao obter dados do usuário");
      const html = await res.text();

      // Aqui você pode parsear HTML ou usar outro endpoint JSON se quiser
      // Para simplicidade, vamos abrir o popup diretamente com os campos preenchidos
      // Exemplo genérico:
      const usuario = {
        nome: document.getElementById("nomeUsuario").value,
        email: document.getElementById("emailUsuario").value,
        telefone: document.getElementById("telefoneUsuario")?.value || "",
        genero: document.getElementById("generoUsuario")?.value || "",
      };
      abrirPopup(usuario);
    } catch (err) {
      console.error(err);
    }
  }

  // Aqui você pode ligar o popup a um botão "Meu perfil"
  const btnAbrirPerfil = document.getElementById("btnAbrirPerfil");
  if (btnAbrirPerfil) {
    btnAbrirPerfil.addEventListener("click", carregarUsuarioSessao);
  }
});
