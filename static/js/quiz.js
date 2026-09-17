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

        criarIndicadores();
        mostrarPergunta();
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar as perguntas.");
    }
}

function criarIndicadores() {
    const container = document.getElementById("questionIndicators");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    perguntas.forEach((_, indice) => {
        const indicador = document.createElement("div");
        indicador.className = "question-indicator";
        indicador.textContent = indice + 1;
        indicador.dataset.index = indice;
        container.appendChild(indicador);
    });
}

function atualizarIndicadores() {
    document.querySelectorAll(".question-indicator").forEach((indicador, indice) => {
        indicador.classList.remove("current", "completed", "incorrect");

        if (indice === perguntaAtual) {
            indicador.classList.add("current");
            indicador.textContent = indice + 1;
            return;
        }

        if (indice < perguntaAtual) {
            const resposta = respostasUsuario[indice];
            const acertou = resposta && resposta.acertou;
            indicador.classList.add(acertou ? "completed" : "incorrect");
            indicador.textContent = acertou ? "✓" : "×";
            return;
        }

        indicador.textContent = indice + 1;
    });
}

function mostrarPergunta() {
    const pergunta = perguntas[perguntaAtual];

    if (!pergunta) {
        return;
    }

    respostaSelecionada = null;

    const total = perguntas.length;
    const atual = perguntaAtual + 1;
    const percentual = Math.round((atual / total) * 100);

    document.getElementById("questionNumber").textContent = `Questão ${atual} de ${total}`;
    document.getElementById("progressPercent").textContent = `${percentual}%`;
    document.getElementById("progressBar").style.width = `${percentual}%`;
    document.getElementById("pontuacaoHeader").textContent = `⭐ ${acertos} pontos`;
    document.getElementById("categoria").textContent = pergunta.categoria;
    document.getElementById("pergunta").textContent = pergunta.pergunta;
    document.getElementById("dica").textContent = pergunta.dica || "Leia com atenção e pense antes de responder.";

    alterarExpressaoBit("pensando");
    atualizarIndicadores();

    const alternativas = document.getElementById("alternativas");
    alternativas.innerHTML = "";

    pergunta.alternativas.forEach((texto, indice) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "answer-option";
        botao.innerHTML = `
            <span class="answer-letter">${String.fromCharCode(65 + indice)}</span>
            <span class="answer-text">${texto}</span>
        `;
        botao.onclick = () => selecionarResposta(indice, botao);
        alternativas.appendChild(botao);
    });

    document.getElementById("feedback").className = "feedback hidden";
    document.getElementById("feedback").innerHTML = "";

    const botaoResponder = document.getElementById("btnResponder");
    botaoResponder.textContent = "Confirmar escolha →";
    botaoResponder.disabled = false;
    botaoResponder.classList.remove("hidden");
    botaoResponder.onclick = confirmarResposta;

    const btnAvancar = document.getElementById("btnAvancar");
    if (btnAvancar) {
        btnAvancar.classList.add("hidden");
        btnAvancar.onclick = proximaPergunta;
    }
}

function selecionarResposta(indice, botao) {
    respostaSelecionada = indice;

    document.querySelectorAll(".answer-option").forEach((item) => {
        item.classList.remove("selected");
    });

    botao.classList.add("selected");
    alterarExpressaoBit("atento");
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

    respostasUsuario[perguntaAtual] = {
        pergunta: pergunta.pergunta,
        resposta: pergunta.alternativas[respostaSelecionada],
        correta: pergunta.alternativas[pergunta.resposta],
        acertou,
        explicacao: pergunta.explicacao,
    };

    document.querySelectorAll(".answer-option").forEach((botao, indice) => {
        botao.disabled = true;
        if (indice === pergunta.resposta) {
            botao.classList.add("correct");
        }
        if (indice === respostaSelecionada && !acertou) {
            botao.classList.add("wrong");
        }
    });

    mostrarFeedback(pergunta, acertou);
    atualizarIndicadores();
    document.getElementById("pontuacaoHeader").textContent = `⭐ ${acertos} pontos`;

    alterarExpressaoBit(acertou ? "comemorando" : "preocupado");
    document.getElementById("dica").textContent = acertou
        ? "Muito bem! Você acertou! 🎉"
        : "Quase! Vamos aprender juntos. 💡";

    const botaoResponder = document.getElementById("btnResponder");
    const btnAvancar = document.getElementById("btnAvancar");

    if (btnAvancar) {
        botaoResponder.classList.add("hidden");
        btnAvancar.classList.remove("hidden");
        btnAvancar.textContent = perguntaAtual === perguntas.length - 1
            ? "Ver resultado →"
            : "Próxima pergunta →";
        btnAvancar.disabled = false;
        btnAvancar.onclick = proximaPergunta;
    } else {
        botaoResponder.textContent = perguntaAtual === perguntas.length - 1
            ? "Ver resultado →"
            : "Próxima pergunta →";
        botaoResponder.disabled = false;
        botaoResponder.onclick = proximaPergunta;
    }
}

function mostrarFeedback(pergunta, acertou) {
    const feedback = document.getElementById("feedback");
    feedback.className = `feedback ${acertou ? "correct" : "wrong"}`;

    feedback.innerHTML = acertou
        ? `
            <div class="feedback-icon">🎉</div>
            <div>
                <h3>🤖✨ Muito bem!</h3>
                <p>Você acertou a questão!</p>
                <p><strong>💡 Explicação:</strong> ${pergunta.explicacao}</p>
            </div>
        `
        : `
            <div class="feedback-icon">💡</div>
            <div>
                <h3>🤖💭 Ops! Não foi dessa vez...</h3>
                <p>Errar também faz parte do processo de aprendizagem.</p>
                <p><strong>📌 Resposta correta:</strong> ${pergunta.alternativas[pergunta.resposta]}</p>
                <p><strong>💡 Dica:</strong> ${pergunta.dica}</p>
                <p><strong>📚 Aprenda:</strong> ${pergunta.explicacao}</p>
            </div>
        `;

    feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function proximaPergunta() {
    perguntaAtual++;

    if (perguntaAtual < perguntas.length) {
        mostrarPergunta();
    } else {
        finalizarQuiz();
    }
}

function alterarExpressaoBit(expressao) {
    const bit = document.getElementById("bitMascot");

    if (!bit) {
        return;
    }

    bit.classList.remove(
        "bit-feliz",
        "bit-pensando",
        "bit-preocupado",
        "bit-comemorando",
        "bit-atento"
    );
    bit.classList.add(`bit-${expressao}`);
}

function configurarAjuda() {
    const btnAjuda = document.getElementById("btnAjuda");

    if (!btnAjuda) {
        return;
    }

    btnAjuda.addEventListener("click", () => {
        const pergunta = perguntas[perguntaAtual];
        if (!pergunta) {
            return;
        }

        document.getElementById("mentorMessageTitle").textContent = "💡 Dica do Bit:";
        document.getElementById("dica").textContent = pergunta.dica || "Pense com calma antes de escolher.";
        alterarExpressaoBit("pensando");
    });
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

    alterarExpressaoBit("comemorando");
    setTimeout(() => {
        window.location.href = "/resultado";
    }, 500);
}

document.addEventListener("DOMContentLoaded", () => {
    configurarAjuda();
    carregarPerguntas();
});
