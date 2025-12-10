import os
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_qdrant import Qdrant

load_dotenv()

def ingest_data():
    # 1. Read the book's content
    documents = []
    docs_dir = os.path.join(os.path.dirname(__file__), "..", "my-book-website", "docs")
    
    for filename in os.listdir(docs_dir):
        if filename.endswith(".md"):
            loader = UnstructuredMarkdownLoader(os.path.join(docs_dir, filename))
            documents.extend(loader.load())

    # 2. Chunk the text
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=350, chunk_overlap=50)
    chunked_documents = text_splitter.split_documents(documents)

    # 3. Generate embeddings and store in Qdrant
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=os.environ.get("GEMINI_API_KEY"))
    qdrant = Qdrant.from_documents(
        chunked_documents,
        embeddings,
        url=os.environ["QDRANT_URL"],
        api_key=os.environ["QDRANT_API_KEY"],
        collection_name="my-book",
    )
    print(f"Ingestion complete. {len(chunked_documents)} chunks added to Qdrant.")

if __name__ == "__main__":
    ingest_data()
