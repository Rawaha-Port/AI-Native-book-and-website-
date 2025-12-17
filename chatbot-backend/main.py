import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Added import
from pydantic import BaseModel
from typing import Optional

from src.services.chatbot_service import qa_chain # New import


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

app.include_router(auth_router) # Include the new auth router

class ChatRequest(BaseModel):
    query: str
    selected_text: Optional[str] = None

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/chat")
async def chat_with_rag(request: ChatRequest):
    if request.selected_text:
        # If selected text is provided, prioritize it
        # More sophisticated handling might involve separate embedding/retrieval for selected text.
        full_query = f"Based on the following text: '{request.selected_text}'. Answer the question: {request.query}"
    else:
        full_query = request.query
    
    response = await qa_chain.ainvoke({"query": full_query})
    
    return {
        "answer": response["result"],
        "sources": [
            {
                "page_content": doc.page_content,
                "source": doc.metadata.get("source", "N/A") # Assuming 'source' key holds the filename
            } 
            for doc in response["source_documents"]
        ]
    }

