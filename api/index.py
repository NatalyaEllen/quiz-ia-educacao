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

mongo_uri = os.getenv("MONGODB_URI")
if not mongo_uri:
	raise RuntimeError("A variável MONGODB_URI não foi configurada.")

client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
db = client["quiz_ia_educacao"]

colecao_perguntas = db["perguntas"]
colecao_resultados = db["resultados"]


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


@app.route("/ranking")
def ranking():
	return render_template("ranking.html")


@app.route("/api/perguntas", methods=["GET"])
def obter_perguntas():
	perguntas = list(colecao_perguntas.find({}, {"_id": 0}))
	return jsonify(perguntas)


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
		"data": datetime.now(),
	}

	colecao_resultados.insert_one(resultado)

	return jsonify({
		"sucesso": True,
		"mensagem": "Resultado salvo com sucesso!",
	})


@app.route("/api/ranking", methods=["GET"])
def obter_ranking():
	ranking = list(
		colecao_resultados.find(
			{},
			{
				"_id": 0,
				"nome": 1,
				"perfis": 1,
				"acertos": 1,
				"total": 1,
				"porcentagem": 1,
			},
		)
		.sort("porcentagem", -1)
		.limit(20)
	)

	return jsonify(ranking)


@app.route("/api/teste")
def teste():
	return jsonify({
		"status": "ok",
		"mensagem": "Quiz IA na Educação funcionando!",
	})


if __name__ == "__main__":
	app.run(host="0.0.0.0", port=5000, debug=True)
