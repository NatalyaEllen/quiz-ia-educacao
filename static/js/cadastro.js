const formulario = document.getElementById("formCadastro");

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

    const usuario = {
        nome,
        perfis,
        disciplina,
    };

    localStorage.setItem("usuarioQuiz", JSON.stringify(usuario));
    window.location.href = "/quiz";
});
