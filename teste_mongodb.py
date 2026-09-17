import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

uri = os.getenv("MONGODB_URI")
if not uri:
    raise RuntimeError("A variável MONGODB_URI não foi configurada.")

client = MongoClient(uri, serverSelectionTimeoutMS=5000)

try:
    client.admin.command("ping")
    print("Conexão com o MongoDB Atlas realizada com sucesso!")
finally:
    client.close()