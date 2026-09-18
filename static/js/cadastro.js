const formulario = document.getElementById("formCadastro");
const perfilOutro = document.getElementById("perfilOutro");
const outroPerfilContainer = document.getElementById("outroPerfilContainer");
const outroPerfil = document.getElementById("outroPerfil");
const tecladoVirtual = document.getElementById("tecladoVirtual");
const teclasLetras = document.getElementById("teclasLetras");
const camposTexto = document.querySelectorAll('#formCadastro input[type="text"]');
let campoAtivo = null;

const teclas = "QWERTYUIOPASDFGHJKLÇZXCVBNM".split("");

teclas.forEach((letra) => {
    const tecla = document.createElement("button");
    tecla.type = "button";
    tecla.className = "keyboard-key";
    tecla.textContent = letra;
    tecla.addEventListener("click", () => inserirTexto(letra));
    teclasLetras.appendChild(tecla);
});

function inserirTexto(texto) {
    if (!campoAtivo) return;

    const inicio = campoAtivo.selectionStart ?? campoAtivo.value.length;
    const fim = campoAtivo.selectionEnd ?? inicio;
    campoAtivo.value = `${campoAtivo.value.slice(0, inicio)}${texto}${campoAtivo.value.slice(fim)}`;
    campoAtivo.focus();
    const novaPosicao = inicio + texto.length;
    campoAtivo.setSelectionRange(novaPosicao, novaPosicao);
}

camposTexto.forEach((campo) => {
    campo.addEventListener("focus", () => {
        campoAtivo = campo;
        campo.insertAdjacentElement("afterend", tecladoVirtual);
        tecladoVirtual.classList.remove("hidden");
    });
});

document.querySelectorAll(".keyboard-key, .keyboard-action").forEach((tecla) => {
    tecla.addEventListener("pointerdown", (event) => event.preventDefault());
});

document.getElementById("teclaEspaco").addEventListener("click", () => inserirTexto(" "));

document.getElementById("teclaApagar").addEventListener("click", () => {
    if (!campoAtivo) return;

    const inicio = campoAtivo.selectionStart ?? campoAtivo.value.length;
    const fim = campoAtivo.selectionEnd ?? inicio;
    if (inicio === 0 && fim === 0) return;

    const inicioRemocao = inicio === fim ? inicio - 1 : inicio;
    campoAtivo.value = `${campoAtivo.value.slice(0, inicioRemocao)}${campoAtivo.value.slice(fim)}`;
    campoAtivo.focus();
    campoAtivo.setSelectionRange(inicioRemocao, inicioRemocao);
});

function fecharTecladoVirtual() {
    tecladoVirtual.classList.add("hidden");
    campoAtivo?.blur();
}

document.getElementById("fecharTeclado").addEventListener("click", fecharTecladoVirtual);
document.getElementById("teclaConcluir").addEventListener("click", fecharTecladoVirtual);

perfilOutro.addEventListener("change", function () {
    outroPerfilContainer.classList.toggle("hidden", !perfilOutro.checked);
    outroPerfil.required = perfilOutro.checked;

    if (!perfilOutro.checked) {
        outroPerfil.value = "";
    }
});

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const disciplina = document.getElementById("disciplina").value.trim();
    const perfis = Array.from(
        document.querySelectorAll('input[name="perfil"]:checked')
    ).map((checkbox) => checkbox.value);

    if (!nome) {
        alert("Digite seu nome para continuar.");
        return;
    }

    if (perfis.length === 0) {
        alert("Selecione pelo menos um perfil.");
        return;
    }

    const perfilPersonalizado = outroPerfil.value.trim();
    if (perfilOutro.checked && !perfilPersonalizado) {
        alert("Digite seu perfil para continuar.");
        outroPerfil.focus();
        return;
    }

    if (perfilOutro.checked) {
        perfis[perfis.indexOf("Outro")] = `Outro: ${perfilPersonalizado}`;
    }

    const usuario = {
        nome,
        perfis,
        disciplina,
    };

    localStorage.setItem("usuarioQuiz", JSON.stringify(usuario));
    window.location.href = "/quiz";
});
