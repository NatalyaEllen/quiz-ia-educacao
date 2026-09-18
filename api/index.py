from datetime import datetime
import os

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request
from pymongo import MongoClient

load_dotenv()

app = Flask(
	__name__,
	template_folder="../templates",
	static_folder="../static",
)

PERGUNTAS_FALLBACK = [
	{
		"numero": 1,
		"categoria": "Uso responsável",
		"pergunta": "Qual é uma atitude adequada ao utilizar Inteligência Artificial para produzir material didático?",
		"alternativas": [
			"Copiar qualquer conteúdo gerado pela IA sem verificar.",
			"Utilizar a IA como apoio e revisar o conteúdo antes de utilizá-lo.",
			"Permitir que a IA substitua completamente o professor.",
			"Utilizar dados pessoais dos alunos para melhorar qualquer resposta.",
		],
		"resposta": 1,
		"dica": "Pense no papel do professor durante o processo.",
		"explicacao": "A IA pode auxiliar na produção de materiais, mas o professor deve revisar, adaptar e validar o conteúdo antes de utilizá-lo.",
	},
	{
		"numero": 2,
		"categoria": "Pensamento crítico",
		"pergunta": "Por que é importante verificar informações produzidas por uma IA generativa?",
		"alternativas": [
			"Porque a IA pode produzir informações incorretas ou desatualizadas.",
			"Porque toda resposta de IA é necessariamente falsa.",
			"Porque a IA nunca consegue produzir textos.",
			"Porque somente professores podem pesquisar informações.",
		],
		"resposta": 0,
		"dica": "Uma resposta pode parecer convincente e ainda assim conter erros.",
		"explicacao": "Modelos de IA podem gerar respostas plausíveis que contêm erros factuais. Por isso, a conferência em fontes confiáveis é importante.",
	},
	{
		"numero": 3,
		"categoria": "Privacidade",
		"pergunta": "Qual prática é mais adequada ao utilizar ferramentas de IA com informações de estudantes?",
		"alternativas": [
			"Enviar todos os dados pessoais dos estudantes.",
			"Publicar os dados dos alunos em prompts.",
			"Evitar inserir dados pessoais ou sensíveis desnecessários.",
			"Compartilhar documentos escolares completos sem verificar.",
		],
		"resposta": 2,
		"dica": "Pense na proteção das informações pessoais dos estudantes.",
		"explicacao": "Informações pessoais e sensíveis devem ser protegidas. Sempre que possível, evite inserir dados identificáveis em ferramentas de IA.",
	},
	{
		"numero": 4,
		"categoria": "Autoria",
		"pergunta": "Qual é uma atitude adequada quando um estudante utiliza IA para auxiliar em um trabalho?",
		"alternativas": [
			"Entregar integralmente o texto produzido pela IA.",
			"Usar a IA como apoio e desenvolver sua própria compreensão e autoria.",
			"Esconder completamente o uso da ferramenta.",
			"Pedir para a IA inventar referências bibliográficas.",
		],
		"resposta": 1,
		"dica": "A tecnologia pode auxiliar, mas não deve eliminar a autoria do estudante.",
		"explicacao": "O estudante deve compreender o conteúdo, desenvolver seu próprio raciocínio e seguir as orientações da instituição sobre o uso de IA.",
	},
	{
		"numero": 5,
		"categoria": "Alucinação",
		"pergunta": "O que significa uma alucinação de IA?",
		"alternativas": [
			"Quando a IA apresenta uma resposta sempre correta.",
			"Quando a IA deixa de funcionar completamente.",
			"Quando a IA gera uma informação incorreta apresentada de maneira convincente.",
			"Quando o professor corrige uma resposta da IA.",
		],
		"resposta": 2,
		"dica": "A resposta pode parecer verdadeira mesmo quando não é.",
		"explicacao": "Alucinação é o termo utilizado para situações em que sistemas generativos produzem informações incorretas ou inventadas com aparência de plausibilidade.",
	},
	{
		"numero": 6,
		"categoria": "Professor",
		"pergunta": "Qual deve ser o papel do professor ao utilizar Inteligência Artificial?",
		"alternativas": [
			"Delegar todas as decisões pedagógicas à IA.",
			"Utilizar a IA como apoio mantendo sua responsabilidade pedagógica.",
			"Deixar que a IA determine as notas dos estudantes sem revisão.",
			"Substituir todas as atividades humanas por automações.",
		],
		"resposta": 1,
		"dica": "Quem possui responsabilidade pedagógica pela turma?",
		"explicacao": "A IA pode apoiar planejamento, criação de materiais e outras tarefas, mas a responsabilidade pedagógica permanece com o professor.",
	},
	{
		"numero": 7,
		"categoria": "Ética",
		"pergunta": "Qual atitude contribui para um uso ético da Inteligência Artificial na educação?",
		"alternativas": [
			"Usar a IA sem considerar seus possíveis impactos.",
			"Ocultar qualquer uso da ferramenta.",
			"Considerar transparência, responsabilidade, privacidade e pensamento crítico.",
			"Aceitar automaticamente todas as decisões produzidas por algoritmos.",
		],
		"resposta": 2,
		"dica": "Pense nos princípios que protegem as pessoas durante o uso da tecnologia.",
		"explicacao": "Um uso ético envolve responsabilidade, transparência, proteção de dados, avaliação crítica e consideração dos impactos da tecnologia.",
	},
	{
		"numero": 8,
		"categoria": "Referências",
		"pergunta": "O que deve ser feito quando uma IA apresenta uma referência bibliográfica?",
		"alternativas": [
			"Considerar a referência verdadeira automaticamente.",
			"Verificar se a obra e os dados bibliográficos realmente existem.",
			"Alterar o nome do autor para evitar problemas.",
			"Utilizar referências inventadas quando não houver fontes.",
		],
		"resposta": 1,
		"dica": "Uma referência pode parecer acadêmica e ainda assim ser inexistente.",
		"explicacao": "Sistemas generativos podem produzir referências inexistentes. É necessário verificar a existência da obra e seus dados em fontes confiáveis.",
	},
	{
		"numero": 9,
		"categoria": "Aprendizagem",
		"pergunta": "Qual uso da IA favorece o desenvolvimento do pensamento crítico?",
		"alternativas": [
			"Pedir respostas prontas para todas as atividades.",
			"Usar a IA para comparar ideias, questionar respostas e aprofundar conceitos.",
			"Copiar textos sem compreender o conteúdo.",
			"Evitar qualquer pesquisa adicional.",
		],
		"resposta": 1,
		"dica": "Use a IA para pensar melhor, e não para deixar de pensar.",
		"explicacao": "A IA pode ser utilizada como ferramenta de reflexão, comparação e exploração de ideias, desde que o estudante analise criticamente as respostas.",
	},
	{
		"numero": 10,
		"categoria": "Responsabilidade digital",
		"pergunta": "Qual princípio resume melhor o uso responsável da IA na educação?",
		"alternativas": [
			"A tecnologia deve substituir o pensamento humano.",
			"Tudo que a IA produz deve ser considerado verdadeiro.",
			"A IA deve ser utilizada com responsabilidade, verificação e supervisão humana.",
			"A IA deve ser utilizada somente para copiar conteúdos.",
		],
		"resposta": 2,
		"dica": "Pense na relação entre tecnologia, responsabilidade e ser humano.",
		"explicacao": "A IA deve funcionar como ferramenta de apoio. A supervisão humana, a verificação das informações e a responsabilidade pelo resultado continuam sendo fundamentais.",
	},
]

mongo_uri = os.getenv("MONGODB_URI")
client = None
colecao_perguntas = None
colecao_resultados = None

if mongo_uri:
	try:
		client = MongoClient(
			mongo_uri,
			serverSelectionTimeoutMS=10000,
			tls=True,
		)
		db = client["quiz_ia_educacao"]
		colecao_perguntas = db["perguntas"]
		colecao_resultados = db["resultados"]
		client.admin.command("ping")
	except Exception as exc:
		print(f"MongoDB indisponível: {exc}")
		client = None
		colecao_perguntas = None
		colecao_resultados = None


@app.route("/")
def inicio():
	return render_template("index.html")


@app.route("/cadastro")
def cadastro():
	return render_template("cadastro.html")


@app.route("/quiz")
def quiz():
	return render_template("quiz.html")


@app.route("/resultado")
def resultado():
	return render_template("resultado.html")


@app.route("/api/perguntas", methods=["GET"])
def obter_perguntas():
	if colecao_perguntas is not None:
		try:
			perguntas = list(colecao_perguntas.find({}, {"_id": 0}))
			if perguntas:
				return jsonify(perguntas)
		except Exception as exc:
			print(f"Erro ao consultar MongoDB: {exc}")
	return jsonify(PERGUNTAS_FALLBACK)


@app.route("/api/resultados", methods=["POST"])
def salvar_resultado():
	dados = request.get_json(silent=True) or {}

	resultado = {
		"nome": dados.get("nome"),
		"perfis": dados.get("perfis", []),
		"disciplina": dados.get("disciplina", ""),
		"acertos": dados.get("acertos", 0),
		"total": dados.get("total", 0),
		"porcentagem": dados.get("porcentagem", 0),
		"respostas": dados.get("respostas", []),
		"data": datetime.now(),
	}

	if colecao_resultados is not None:
		try:
			colecao_resultados.insert_one(resultado)
		except Exception as exc:
			print(f"Erro ao salvar no MongoDB: {exc}")

	return jsonify({
		"sucesso": True,
		"mensagem": "Resultado salvo com sucesso!",
	})


@app.route("/api/teste")
def teste():
	return jsonify({
		"status": "ok",
		"mensagem": "Quiz IA na Educação funcionando!",
	})


if __name__ == "__main__":
	app.run(host="0.0.0.0", port=5000, debug=True)
