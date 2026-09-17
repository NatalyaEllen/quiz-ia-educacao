const formulario = document.getElementById("formCadastro");
const perfilOutro = document.getElementById("perfilOutro");
const outroPerfilContainer = document.getElementById("outroPerfilContainer");
const outroPerfil = document.getElementById("outroPerfil");

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
