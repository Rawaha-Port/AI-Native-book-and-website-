import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Added import
from pydantic import BaseModel
from typing import Optional

from langchain.vectorstores import Qdrant
from langchain.embeddings import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA

load_dotenv()
app = FastAPI() # Added FastAPI app instance

origins = [
    "http://localhost",
    "http://localhost:3000", # Frontend Docusaurus URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from src.api.auth import router as auth_router # New import

# Initialize Qdrant and OpenAI components
embeddings = OpenAIEmbeddings()
qdrant = Qdrant(
    url=os.environ["QDRANT_URL"],
    api_key=os.environ["QDRANT_API_KEY"],
    collection_name="my-book",
    embeddings=embeddings,
)
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=qdrant.as_retriever(),
    return_source_documents=True
)

app.include_router(auth_router) # Include the new auth router

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/chat")
async def chat_with_rag(request: ChatRequest):
    if request.selected_text:
        # If selected text is provided, prioritize it
        # For simplicity, we'll append it to the query for now.
        # More sophisticated handling might involve separate embedding/retrieval for selected text.
        full_query = f"Based on the following text: '{request.selected_text}'. Answer the question: {request.query}"
    else:
        full_query = request.query
    
    response = qa_chain.invoke({"query": full_query})
    return {
        "answer": response["result"],
        "sources": [{"page_content": doc.page_content, "metadata": doc.metadata} for doc in response["source_documents"]]
    }

