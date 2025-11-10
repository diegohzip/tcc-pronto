document.addEventListener("DOMContentLoaded", () => {
  // Função para ativar/desativar a expansão da resposta da FAQ
  const toggleFAQ = () => {
    const perguntas = document.querySelectorAll('.faq-pergunta');
    if (!perguntas.length) return;

    perguntas.forEach(pergunta => {
      const resposta = pergunta.nextElementSibling;
      if (!resposta) return;

      pergunta.addEventListener('click', () => {
        const ativa = pergunta.classList.toggle('ativa');
        resposta.style.maxHeight = ativa ? `${resposta.scrollHeight}px` : '0';
      });
    });
  };

  // Função para abrir o popup
  const abrirPopup = (popup) => {
    if (popup) popup.style.display = "flex";
  };

  // Função para fechar o popup
  const fecharPopup = (popup) => {
    if (popup) popup.style.display = "none";
  };

  // Inicializa controle do popup dos Termos de Uso
  const initPopupTermos = () => {
    const abrirTermos = document.getElementById("abrir-termos");
    const popupTermos = document.getElementById("popup-termos");
    const fecharTermos = document.getElementById("fechar-termos");
    const botaoOkTermos = document.getElementById("botao-ok-termos");

    if (!(abrirTermos && popupTermos && fecharTermos && botaoOkTermos)) return;

    abrirTermos.addEventListener("click", e => {
      e.preventDefault();
      abrirPopup(popupTermos);
    });

    fecharTermos.addEventListener("click", () => fecharPopup(popupTermos));
    botaoOkTermos.addEventListener("click", () => fecharPopup(popupTermos));

    // Fechar popup ao clicar fora do conteúdo
    popupTermos.addEventListener("click", (e) => {
      if (e.target === popupTermos) fecharPopup(popupTermos);
    });
  };

  // Executa as funções de inicialização
  toggleFAQ();
  initPopupTermos();
});
