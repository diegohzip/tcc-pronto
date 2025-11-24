const perguntas = [
  "genero",
  "experiencia",
  "condicao",
  "lesao",
  "dias",
  "academia"
];

const totalPerguntas = perguntas.length;
const progressBar = document.getElementById("progressBar");
const formulario = document.getElementById("formulario");
const resultadoDiv = document.getElementById("resultado");

// Atualiza a barra de progresso
function atualizarProgresso(atual) {
  const percentual = (atual / totalPerguntas) * 100;
  progressBar.style.width = percentual + "%";
}

// Mostra a próxima pergunta
function mostrarPergunta(index) {
  if (index < totalPerguntas) {
    const proxPergunta = document.getElementById(`pergunta${index + 1}`);
    if (proxPergunta) proxPergunta.style.display = "block";
  } else {
    document.getElementById("submitBtn").style.display = "block";
  }
}

// Oculta todas as perguntas exceto a primeira
for (let i = 2; i <= totalPerguntas; i++) {
  const p = document.getElementById(`pergunta${i}`);
  if (p) p.style.display = "none";
}
document.getElementById("submitBtn").style.display = "none";
atualizarProgresso(0);

// Pré-seleciona o gênero com base no usuário logado
document.addEventListener("DOMContentLoaded", () => {
  if (typeof usuario !== "undefined" && usuario.genero) {
    const selectGenero = document.getElementById("genero");
    switch (usuario.genero.toLowerCase()) {
      case "masculino": selectGenero.value = "homem"; break;
      case "feminino": selectGenero.value = "mulher"; break;
      default: selectGenero.value = "";
    }
    if (selectGenero.value !== "") {
      mostrarPergunta(1);
      atualizarProgresso(1);
    }
  }
});

// Eventos de mudança nos selects
perguntas.forEach((id, idx) => {
  const select = document.getElementById(id);
  select.addEventListener("change", () => {
    if (id === "lesao" && select.value === "sim") {
      resultadoDiv.innerHTML = `
        <h2>Aviso Importante</h2>
        <p style="color: red; font-weight: bold;">
          Não é possível gerar uma ficha de treino personalizada em caso de lesão.
          Recomendamos que você procure um profissional da saúde ou um educador físico.
        </p>
      `;
      for (let i = idx + 1; i < totalPerguntas; i++) {
        const p = document.getElementById(`pergunta${i + 1}`);
        if (p) p.style.display = "none";
      }
      document.getElementById("submitBtn").style.display = "none";
      atualizarProgresso(idx + 1);
      return;
    } else if (id === "lesao") {
      resultadoDiv.innerHTML = "";
    }

    let respondidas = 0;
    for (let i = 0; i < totalPerguntas; i++) {
      const val = document.getElementById(perguntas[i]).value;
      if (val !== "") respondidas++;
    }
    atualizarProgresso(respondidas);

    if (select.value !== "") mostrarPergunta(idx + 1);
    else {
      for (let i = idx + 1; i < totalPerguntas; i++) {
        const p = document.getElementById(`pergunta${i + 1}`);
        if (p) p.style.display = "none";
      }
      document.getElementById("submitBtn").style.display = "none";
      atualizarProgresso(idx);
    }
  });
});

// Funções de favoritos
function favoritarFicha(chave) {
  let favoritos = JSON.parse(localStorage.getItem("fichasFavoritas")) || [];
  if (!favoritos.includes(chave)) {
    favoritos.push(chave);
    localStorage.setItem("fichasFavoritas", JSON.stringify(favoritos));
    alert("Ficha adicionada aos favoritos!");
  } else {
    alert("Esta ficha já está nos favoritos.");
  }
}

// Função para redefinir o questionário
function redefinirQuestionario() {
  perguntas.forEach(id => {
    const select = document.getElementById(id);
    if (select) select.value = "";
  });

  for (let i = 2; i <= totalPerguntas; i++) {
    const p = document.getElementById(`pergunta${i}`);
    if (p) p.style.display = "none";
  }

  document.getElementById("submitBtn").style.display = "none";
  resultadoDiv.innerHTML = "";
  atualizarProgresso(0);
  mostrarPergunta(0);
}

// Botão redefinir
const botaoRedefinir = document.getElementById("botaoRedefinir");
botaoRedefinir.addEventListener("click", redefinirQuestionario);

// Submit do formulário
formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const genero = document.getElementById("genero").value;
  const experiencia = document.getElementById("experiencia").value;
  const condicao = document.getElementById("condicao").value;
  const lesao = document.getElementById("lesao").value;
  const dias = document.getElementById("dias").value;
  const academia = document.getElementById("academia").value;

  if (lesao === "sim") {
    resultadoDiv.innerHTML = `
      <h2>Aviso Importante</h2>
      <p style="color: red; font-weight: bold;">
        Não é possível gerar uma ficha de treino personalizada em caso de lesão.
        Recomendamos que você procure um profissional da saúde ou um educador físico.
      </p>
    `;
    return;
  }

  const chave = `${genero}-${experiencia}-${condicao}-${dias}-${academia}`;
  const ficha = fichas[chave];

  if (!ficha) {
    resultadoDiv.innerHTML = `
      <h2>Erro</h2>
      <p>Não foi possível encontrar uma ficha para essa combinação. Tente novamente.</p>
    `;
    return;
  }

  exibirFicha(chave, ficha, dias);
});

// Exibir ficha
function exibirFicha(chave, ficha, dias) {
  const fichaCards = document.getElementById("ficha-cards");
  fichaCards.innerHTML = "";

  resultadoDiv.innerHTML = `<h2>Ficha de Treino - ${dias} dias/semana</h2>`;

  ficha.forEach((dia, index) => {
    const card = document.createElement("div");
    card.classList.add("ficha-card");
    card.innerHTML = `<h3>Dia ${index + 1}</h3>`;

    const ul = document.createElement("ul");
    dia.forEach(exercicio => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="exercicio-nome">${exercicio}</span>
                      <img class="flecha-direita" src="images/flecha.png" alt="→" />`;
      li.style.cursor = "pointer";
      li.addEventListener("click", () => mostrarDescricaoExercicio(exercicio));
      ul.appendChild(li);
    });

    card.appendChild(ul);
    fichaCards.appendChild(card);
  });

  // Botão de download
  const botaoDownload = document.createElement("a");
  botaoDownload.href = `/fichas/${chave}.pdf`;
  botaoDownload.download = `${chave}.pdf`;
  botaoDownload.textContent = "Baixar Ficha";
  botaoDownload.style.cssText = "display:inline-block;margin-top:20px;padding:10px 20px;background-color:#d00000;color:#fff;border-radius:5px;text-decoration:none;font-weight:bold;";
  resultadoDiv.appendChild(botaoDownload);

  // Botão gerar ficha parecida
  const botaoParecida = document.createElement("button");
  botaoParecida.textContent = "Gerar outra parecida";
  botaoParecida.style.cssText = "display:inline-block;margin-top:10px;margin-left:10px;padding:10px 20px;background-color:#d00000;color:#fff;border:none;border-radius:5px;cursor:pointer;font-weight:bold;";
  botaoParecida.addEventListener("click", () => gerarFichaParecida(chave));
  resultadoDiv.appendChild(botaoParecida);
}

// Função gerar ficha parecida respeitando os dias escolhidos
function gerarFichaParecida(chaveAtual) {
  const diasSelecionados = document.getElementById("dias").value;

  const chavesParecidas = Object.keys(fichas).filter(chave => {
    const partes = chave.split("-");
    return partes[3] === diasSelecionados && chave !== chaveAtual;
  });

  if (chavesParecidas.length === 0) {
    alert("Não encontramos uma ficha parecida com o mesmo número de dias.");
    return;
  }

  const novaChave = chavesParecidas[Math.floor(Math.random() * chavesParecidas.length)];
  const novaFicha = fichas[novaChave];

  exibirFicha(novaChave, novaFicha, diasSelecionados);
}

// Pop-up descrição de exercício
const popup = document.getElementById("popupDescricao");
const descricaoTexto = document.getElementById("descricaoTexto");
const fecharPopup = document.getElementById("fecharPopup");

function mostrarDescricaoExercicio(exercicio) {
  const descricao = descricoesExercicios[exercicio] || "Descrição não disponível.";
  const videoLink = linksYoutube[exercicio] || "Link não disponível.";

  descricaoTexto.innerHTML = `
    <strong>${exercicio}</strong><br><br>
    <p><strong>Séries X Repetições:</strong> 4x10</p><br>
    <p>${descricao}</p><br>
    <label>Tutorial em vídeo:</label><br>
    <input type="text" class="video-link" value="${videoLink}" readonly onclick="window.open('${videoLink}', '_blank')" />
  `;
  popup.classList.add("show");
}

fecharPopup.addEventListener("click", () => popup.classList.remove("show"));
popup.addEventListener("click", (event) => {
  if (event.target === popup) popup.classList.remove("show");
});

// --- CALCULADORA DE IMC --- //
const abrirCalculadoraIMC = document.getElementById("abrirCalculadoraIMC");
const popupIMC = document.getElementById("popupIMC");
const fecharPopupIMC = document.getElementById("fecharPopupIMC");
const calcularIMC = document.getElementById("calcularIMC");
const resultadoIMC = document.getElementById("resultadoIMC");

abrirCalculadoraIMC.addEventListener("click", () => popupIMC.classList.add("show"));
fecharPopupIMC.addEventListener("click", () => popupIMC.classList.remove("show"));
popupIMC.addEventListener("click", (e) => {
  if (e.target === popupIMC) popupIMC.classList.remove("show");
});

calcularIMC.addEventListener("click", () => {
  const peso = parseFloat(document.getElementById("peso").value);
  const altura = parseFloat(document.getElementById("altura").value);

  if (!peso || !altura || altura <= 0) {
    resultadoIMC.innerHTML = `<p style="color:red;">Preencha os campos corretamente.</p>`;
    return;
  }

  const imc = peso / (altura * altura);
  let classificacao = "";

  if (imc < 18.5) classificacao = "Abaixo do peso - Mediana";
  else if (imc < 24.9) classificacao = "Peso normal - Boa";
  else if (imc < 29.9) classificacao = "Sobrepeso - Mediana";
  else if (imc < 34.9) classificacao = "Obesidade Grau I - Ruim";
  else if (imc < 39.9) classificacao = "Obesidade Grau II - Ruim";
  else classificacao = "Obesidade Grau III - Ruim";

  resultadoIMC.innerHTML = `
    <p><strong>IMC:</strong> ${imc.toFixed(2)}</p>
    <p><strong>Classificação:</strong> ${classificacao}</p>
  `;
});
