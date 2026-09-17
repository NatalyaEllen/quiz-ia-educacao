let perguntas = [];
let perguntaAtual = 0;
let respostaSelecionada = null;
let acertos = 0;
let respostasUsuario = [];
let usuario = null;

async function carregarPerguntas() {
    try {
        const resposta = await fetch("/api/perguntas");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar as perguntas.");
        }

        perguntas = await resposta.json();

        if (!perguntas.length) {
            alert("Nenhuma pergunta encontrada.");
            return;
        }

        mostrarPergunta();
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar as perguntas.");
    }
}

function mostrarPergunta() {
    const pergunta = perguntas[perguntaAtual];
    respostaSelecionada = null;

    document.getElementById("numeroPergunta").textContent =
        `Pergunta ${perguntaAtual + 1} de ${perguntas.length}`;

    const porcentagem = Math.round(
        ((perguntaAtual + 1) / perguntas.length) * 100
    );

    document.getElementById("porcentagem").textContent = `${porcentagem}%`;
    document.getElementById("progress").style.width = `${porcentagem}%`;
    document.getElementById("pontuacaoHeader").textContent = `⭐ ${acertos} pontos`;
    document.getElementById("categoria").textContent = pergunta.categoria;
    document.getElementById("pergunta").textContent = pergunta.pergunta;
    document.getElementById("dica").textContent = pergunta.dica;

    const alternativas = document.getElementById("alternativas");
    alternativas.innerHTML = "";

    pergunta.alternativas.forEach((texto, indice) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "answer-option";

        const letra = String.fromCharCode(65 + indice);
        botao.innerHTML = `
            <span class="answer-letter">${letra}</span>
            <span>${texto}</span>
        `;

        botao.onclick = () => selecionarResposta(indice, botao);
        alternativas.appendChild(botao);
    });

    document.getElementById("feedback").className = "feedback hidden";
    document.getElementById("feedback").innerHTML = "";

    const botaoResponder = document.getElementById("btnResponder");
    botaoResponder.textContent = "Confirmar escolha →";
    botaoResponder.disabled = false;
    botaoResponder.onclick = confirmarResposta;
}

function selecionarResposta(indice, botao) {
    respostaSelecionada = indice;

    document.querySelectorAll(".answer-option").forEach((item) => {
        item.classList.remove("selected");
    });

    botao.classList.add("selected");
}

function confirmarResposta() {
    if (respostaSelecionada === null) {
        alert("Escolha uma alternativa primeiro.");
        return;
    }

    const pergunta = perguntas[perguntaAtual];
    const acertou = respostaSelecionada === pergunta.resposta;

    if (acertou) {
        acertos++;
    }

    respostasUsuario.push({
        pergunta: pergunta.pergunta,
        resposta: pergunta.alternativas[respostaSelecionada],
        correta: pergunta.alternativas[pergunta.resposta],
        acertou,
        explicacao: pergunta.explicacao,
    });

    document.querySelectorAll(".answer-option").forEach((botao) => {
        botao.disabled = true;
    });

    mostrarFeedback(pergunta, acertou);
}

function mostrarFeedback(pergunta, acertou) {
    const feedback = document.getElementById("feedback");
    feedback.className = `feedback ${acertou ? "correct" : "wrong"}`;

    if (acertou) {
        feedback.innerHTML = `
            <h3>🤖✨ Muito bem!</h3>
            <p>Você acertou a questão!</p>
            <p><strong>💡 Explicação:</strong> ${pergunta.explicacao}</p>
        `;
    } else {
        feedback.innerHTML = `
            <h3>🤖💭 Ops! Não foi dessa vez...</h3>
            <p>Não se preocupe! Errar também faz parte do processo de aprendizagem.</p>
            <p><strong>💡 Dica:</strong> ${pergunta.dica}</p>
            <p><strong>📚 Aprenda:</strong> ${pergunta.explicacao}</p>
        `;
    }

    const botaoResponder = document.getElementById("btnResponder");
    botaoResponder.textContent =
        perguntaAtual === perguntas.length - 1
            ? "Ver resultado →"
            : "Próxima pergunta →";
    botaoResponder.disabled = false;
    botaoResponder.onclick = proximaPergunta;
    document.getElementById("pontuacaoHeader").textContent = `⭐ ${acertos} pontos`;
}

function proximaPergunta() {
    perguntaAtual++;

    if (perguntaAtual < perguntas.length) {
        mostrarPergunta();
    } else {
        finalizarQuiz();
    }
}

async function finalizarQuiz() {
    const total = perguntas.length;
    const porcentagem = Math.round((acertos / total) * 100);
    const usuarioSalvo = localStorage.getItem("usuarioQuiz");

    if (usuarioSalvo) {
        usuario = JSON.parse(usuarioSalvo);
    }

    const resultado = {
        nome: usuario?.nome || "Visitante",
        perfis: usuario?.perfis || ["Visitante"],
        disciplina: usuario?.disciplina || "",
        acertos,
        total,
        porcentagem,
    };

    localStorage.setItem(
        "resultadoQuiz",
        JSON.stringify({ ...resultado, respostas: respostasUsuario })
    );

    try {
        const resposta = await fetch("/api/resultados", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resultado),
        });

        if (!resposta.ok) {
            throw new Error("O servidor não aceitou o resultado.");
        }
    } catch (erro) {
        console.error("Erro ao salvar resultado:", erro);
    }

    window.location.href = "/resultado";
}

document.addEventListener("DOMContentLoaded", carregarPerguntas);
