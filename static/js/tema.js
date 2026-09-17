function aplicarTema() {
    const tema = localStorage.getItem("tema") || "escuro";

    if (tema === "claro") {
        document.body.classList.add("light");
    } else {
        document.body.classList.remove("light");
    }
}

function alternarTema() {
    const temaAtual = localStorage.getItem("tema") || "escuro";
    const novoTema = temaAtual === "escuro" ? "claro" : "escuro";

    localStorage.setItem("tema", novoTema);
    aplicarTema();
}

document.addEventListener("DOMContentLoaded", aplicarTema);
