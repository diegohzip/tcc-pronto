// login.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const registerbtn = document.getElementById("register");
  const loginbtn = document.getElementById("login");

  // Alternar entre telas de login e cadastro
  registerbtn.addEventListener("click", () => container.classList.add("active"));
  loginbtn.addEventListener("click", () => container.classList.remove("active"));

  // Controle do pop-up dos Termos de Uso
  document.getElementById("abrir-termos").addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("popup-termos").style.display = "flex";
  });

  document.getElementById("fechar-termos").addEventListener("click", () => {
    document.getElementById("popup-termos").style.display = "none";
  });

  // --- LOGIN ---
  const formLogin = document.getElementById("formLogin");
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!email || !senha) {
      alert("⚠️ Email e senha são obrigatórios.");
      return;
    }

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
        credentials: "include"
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.erro || "Erro no login.");

      alert("✅ Login realizado com sucesso!");
      window.location.href = data.redirectTo || "/"; // redireciona para última rota ou página inicial
    } catch (err) {
      console.error("Erro no login:", err);
      alert(err.message);
    }
  });

  // --- CADASTRO ---
  const formCadastro = document.getElementById("formCadastro");
  formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const nascimento = document.getElementById("nascimento").value.trim();
    const email = document.getElementById("emailCadastro").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const genero = document.getElementById("genero").value;
    const senha = document.getElementById("senhaCadastro").value.trim();
    const redirectTo = "/"; // redireciona para a página inicial após cadastro

    if (!nome || !nascimento || !email || !telefone || !genero || !senha) {
      alert("⚠️ Todos os campos são obrigatórios.");
      return;
    }

    try {
      const res = await fetch("/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, nascimento, email, telefone, genero, senha, redirectTo }),
        credentials: "include"
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.erro || "Erro no cadastro.");

      alert("✅ Cadastro realizado com sucesso!");
      window.location.href = "/"; // redireciona para página inicial
    } catch (err) {
      console.error("Erro no cadastro:", err);
      alert(err.message);
    }
  });
});


