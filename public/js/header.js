document.addEventListener("DOMContentLoaded", () => {
  const abrirPerfil = document.getElementById("abrirPerfil");
  const popupPerfil = document.getElementById("popupPerfil");
  const fecharPopup = document.getElementById("fecharPopupPerfil");
  const btnEditar = document.getElementById("btnEditar");
  const btnSalvar = document.getElementById("btnSalvar");
  const formPerfil = document.getElementById("formPerfil");
  const telefoneInput = document.getElementById("telefoneUsuario");

  if (!abrirPerfil || !popupPerfil) return;

  // === Abrir popup ===
  abrirPerfil.addEventListener("click", () => {
    popupPerfil.style.display = "flex";
  });

  // === Fechar popup ===
  fecharPopup.addEventListener("click", () => {
    popupPerfil.style.display = "none";
  });
  popupPerfil.addEventListener("click", (e) => {
    if (e.target === popupPerfil) popupPerfil.style.display = "none";
  });

  // === Habilitar edição ===
  btnEditar.addEventListener("click", () => {
    document.querySelectorAll("#formPerfil input, #formPerfil select").forEach(el => el.disabled = false);
    btnEditar.style.display = "none";
    btnSalvar.style.display = "inline-block";
  });

  // === Aplicar máscara e limitar o telefone ===
  if (telefoneInput) {
    // Bloqueia caracteres não numéricos
    telefoneInput.addEventListener("keypress", (e) => {
      if (!/[0-9]/.test(e.key)) e.preventDefault();
    });

    // Formata e limita a 11 números
    telefoneInput.addEventListener("input", (e) => {
      let valor = e.target.value.replace(/\D/g, ""); // remove tudo que não for número

      // limita a 11 dígitos
      if (valor.length > 11) valor = valor.slice(0, 11);

      // aplica a máscara
      if (valor.length > 6) {
        valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
      } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
      } else {
        valor = valor.replace(/^(\d*)/, "($1");
      }

      e.target.value = valor;
    });
  }

  // === Salvar alterações ===
  formPerfil.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nomeUsuario").value.trim();
    const email = document.getElementById("emailUsuario").value.trim();
    const telefone = document.getElementById("telefoneUsuario").value.trim();
    const genero = document.getElementById("generoUsuario").value;

    if (!nome || !email || !telefone || !genero) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    btnSalvar.disabled = true;
    btnSalvar.textContent = "Salvando...";

    try {
      const response = await fetch("/usuarios/atualizar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ nome, email, telefone, genero }),
        credentials: "include"
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Resposta do servidor não é JSON válida.");
      }

      const result = await response.json();

      alert("Dados atualizados com sucesso!");
      document.querySelectorAll("#formPerfil input, #formPerfil select").forEach(el => el.disabled = true);
      btnEditar.style.display = "inline-block";
      btnSalvar.style.display = "none";
      popupPerfil.style.display = "none";

      // Atualiza o nome exibido no header
      const areaUsuario = document.getElementById("areaUsuario");
      if (areaUsuario && result.usuario && result.usuario.nome) {
        areaUsuario.querySelector("#abrirPerfil").textContent = `👤 ${result.usuario.nome}`;
      }

    } catch (err) {
      console.error("Erro detalhado:", err);
      alert(err.message || "Erro na comunicação com o servidor.");
    } finally {
      btnSalvar.disabled = false;
      btnSalvar.textContent = "Salvar";
    }
  });
});
