document.addEventListener("DOMContentLoaded", carregarUsuarios);

async function carregarUsuarios() {
  try {
    const res = await fetch("/admin/usuarios");
    const usuarios = await res.json();
    const tbody = document.querySelector("#tabelaUsuarios tbody");
    tbody.innerHTML = "";

    if (!usuarios.length) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhum usuário cadastrado.</td></tr>';
      return;
    }

    usuarios.forEach(user => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.nome}</td>
        <td>${user.email}</td>
        <td>
          <button onclick='visualizarUsuario(${JSON.stringify(user)})'>Visualizar / Editar</button>
          <button onclick='deletarUsuario(${user.id})'>Deletar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    const tbody = document.querySelector("#tabelaUsuarios tbody");
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Erro ao carregar usuários.</td></tr>';
  }
}

function visualizarUsuario(user) {
  document.getElementById("detalheId").value = user.id;
  document.getElementById("detalheNome").value = user.nome || "";
  document.getElementById("detalheEmail").value = user.email || "";
  document.getElementById("detalheTelefone").value = user.telefone || "";
  document.getElementById("detalheGenero").value = user.genero || "outro";

  desabilitarEdicao();
  document.getElementById("modalVisualizar").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modalVisualizar").style.display = "none";
}

function habilitarEdicao() {
  document.getElementById("detalheNome").disabled = false;
  document.getElementById("detalheEmail").disabled = false;
  document.getElementById("detalheTelefone").disabled = false;
  document.getElementById("detalheGenero").disabled = false;
}

function desabilitarEdicao() {
  document.getElementById("detalheNome").disabled = true;
  document.getElementById("detalheEmail").disabled = true;
  document.getElementById("detalheTelefone").disabled = true;
  document.getElementById("detalheGenero").disabled = true;
}

async function salvarUsuario() {
  const id = document.getElementById("detalheId").value;
  const nome = document.getElementById("detalheNome").value.trim();
  const email = document.getElementById("detalheEmail").value.trim();
  const telefone = document.getElementById("detalheTelefone").value.trim();
  const genero = document.getElementById("detalheGenero").value;

  try {
    const res = await fetch(`/admin/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, telefone, genero })
    });
    if (!res.ok) throw new Error("Erro ao atualizar usuário");

    alert("Usuário atualizado com sucesso!");
    carregarUsuarios();
    fecharModal();
  } catch (err) {
    alert(err.message);
  }
}

async function deletarUsuario(id) {
  if (!confirm("Deseja excluir este usuário?")) return;
  try {
    const res = await fetch(`/admin/usuarios/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao deletar usuário");

    alert("Usuário deletado!");
    carregarUsuarios();
  } catch (err) {
    alert(err.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const inputPesquisa = document.getElementById("pesquisaNome");
  const tabela = document.getElementById("tabelaUsuarios").getElementsByTagName("tbody")[0];

  inputPesquisa.addEventListener("input", () => {
    const filtro = inputPesquisa.value.toLowerCase();
    const linhas = tabela.getElementsByTagName("tr");

    for (let i = 0; i < linhas.length; i++) {
      const colunaNome = linhas[i].getElementsByTagName("td")[1];
      if (colunaNome) {
        const nomeTexto = colunaNome.textContent.toLowerCase();
        if (nomeTexto.includes(filtro)) {
          linhas[i].style.display = "";
        } else {
          linhas[i].style.display = "none";
        }
      }
    }
  });
});
