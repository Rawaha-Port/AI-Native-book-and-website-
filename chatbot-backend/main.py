from langchain_classic.chains.retrieval import create_retrieval_chain
from langchain_classic.chains.combine_documents.stuff import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_qdrant import Qdrant
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from src.api import user_profiles
app.include_router(user_profiles.router, prefix="/api")

class ChatRequest(BaseModel):
    query: str
    selected_text: Optional[str] = None

# Initialize Qdrant and Gemini components
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001", google_api_key=os.environ.get("GEMINI_API_KEY"))
qdrant = Qdrant.from_existing_collection(
    url=os.environ["QDRANT_URL"],
    api_key=os.environ["QDRANT_API_KEY"],
    collection_name="my-book",
    embedding=embeddings,
)
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0, google_api_key=os.environ.get("GEMINI_API_KEY"))

system_prompt = (
    "You are an assistant for question-answering tasks. "
    "Use the following pieces of retrieved context to answer "
    "the question. If you don't know the answer, say that you "
    "don't know. Use three sentences maximum and keep the "
    "answer concise."
    "\n\n"
    "{context}"
)

prompt = ChatPromptTemplate.from_messages(

    [

        ("system", system_prompt),

        ("human", "{input}"),

    ]

)



question_answer_chain = create_stuff_documents_chain(llm, prompt)

qa_chain = create_retrieval_chain(qdrant.as_retriever(), question_answer_chain)



@app.get("/")

def read_root():

    return {"Hello": "World"}

@app.post("/chat")
async def chat_with_rag(request: ChatRequest):
    if request.selected_text:
        full_query = f"Based on the following text: '{request.selected_text}'. Answer the question: {request.query}"
    else:
        full_query = request.query
    
    response = await qa_chain.ainvoke({"input": full_query})
    return {
        "answer": response["answer"],
        "sources": [{"page_content": doc.page_content, "metadata": doc.metadata} for doc in response["context"]]
    }

