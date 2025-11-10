// Controle do pop-up dos Termos de Uso
const abrirTermos = document.getElementById("abrir-termos");
const popupTermos = document.getElementById("popup-termos");
const fecharTermos = document.getElementById("fechar-termos");
const botaoOkTermos = document.getElementById("botao-ok-termos");

if (abrirTermos && popupTermos && fecharTermos && botaoOkTermos) {
  abrirTermos.addEventListener("click", function (event) {
    event.preventDefault();
    popupTermos.style.display = "flex";
  });

  fecharTermos.addEventListener("click", function () {
    popupTermos.style.display = "none";
  });

  botaoOkTermos.addEventListener("click", function () {
    popupTermos.style.display = "none";
  });

  popupTermos.addEventListener("click", function (event) {
    if (event.target === popupTermos) {
      popupTermos.style.display = "none";
    }
  });
}

