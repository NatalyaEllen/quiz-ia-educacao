# 🎓 Quiz IA na Educação

Sistema web gamificado desenvolvido para promover a aprendizagem sobre o **uso responsável, ético e consciente da Inteligência Artificial na Educação**.

O sistema apresenta questões interativas, feedback pedagógico, acompanhamento de progresso e um mascote virtual denominado **Bit – o Mentor IA**, que auxilia o usuário durante a realização do quiz.

---

# 1. 📋 Visão Geral

O **Quiz IA na Educação** é uma aplicação web educacional desenvolvida para apoiar processos de conscientização e aprendizagem relacionados ao uso da Inteligência Artificial no contexto educacional.

O sistema permite que o usuário:

- Realize um cadastro simples;
- Informe seu nome;
- Selecione um ou mais perfis;
- Informe opcionalmente a disciplina em que atua;
- Responda questões sobre Inteligência Artificial;
- Receba dicas durante o quiz;
- Solicite ajuda ao mascote Bit;
- Receba feedback após cada resposta;
- Visualize explicações pedagógicas;
- Acompanhe seu progresso;
- Visualize seu resultado ao final do quiz.

> **Importante:** o sistema não possui ranking ou leaderboard. O objetivo é priorizar a aprendizagem individual e o feedback pedagógico.

---

# 2. 🎯 Objetivo do Sistema

O objetivo principal é desenvolver uma ferramenta educacional interativa capaz de auxiliar professores, estudantes e demais usuários na compreensão de práticas responsáveis relacionadas ao uso da Inteligência Artificial na educação.

O sistema busca transformar o processo de aprendizagem em uma experiência mais:

- Interativa;
- Visual;
- Gamificada;
- Acessível;
- Pedagógica;
- Responsável;
- Orientada à reflexão.

---

# 3. 👥 Público-Alvo

O sistema foi projetado para diferentes perfis de usuários relacionados à educação.

Os perfis disponíveis no cadastro são:

1. Professor 1º ano
2. Professor 2º ano
3. Professor 3º ano
4. Professor 4º ano
5. Professor 5º ano
6. Professor 6º ano
7. Professor 7º ano
8. Professor 8º ano
9. Professor 9ª ano
10. Professor Eja
11. ATCOM
12. Estudante
13. Visitante
14. Outros

O usuário pode selecionar mais de um perfil.

O campo **Disciplina que atua** é opcional.
Na opção outros possui o campo para informar o perfil.

---

# 4. 🛠️ Tecnologias Utilizadas

## Front-end

- HTML5
- CSS3
- JavaScript
- Interface responsiva
- Animações CSS
- LocalStorage

## Back-end

- Python
- Flask

## Banco de Dados

- MongoDB Atlas
- PyMongo

## Ambiente de Desenvolvimento

- Visual Studio Code
- Python
- Git
- GitHub

## Deploy

- Vercel

## Testes locais

- Flask Development Server
- Navegador Web
- MongoDB Atlas

---

# 6. 📦 Requisitos de Software

Instalar:

- Python 3.10 ou superior;
- Visual Studio Code;
- Git;
- Navegador atualizado;
- Conta no MongoDB Atlas;
- Conta no GitHub;
- Conta na Vercel para publicação.

---

# 7. 📁 Estrutura do Projeto

A estrutura atual do projeto é:

```text
quiz-iaconsciente-educacao/
│
├── .venv/
│
├── .vscode/
│
├── api/
│   └── index.py
│
├── static/
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── cadastro.js
│       ├── quiz.js
│       ├── resultado.js
│       └── tema.js
│
├── templates/
│   ├── cadastro.html
│   ├── quiz.html
│   └── resultado.html
│
├── .env
├── .env.example
├── .gitignore
├── requirements.txt
├── seed.py
├── teste_mongodb.py
└── README.md