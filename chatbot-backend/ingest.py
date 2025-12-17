import os
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_qdrant import Qdrant
from qdrant_client import QdrantClient
from qdrant_client.http import models # Added import for manual Qdrant operations

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



    # Initialize HuggingFace embeddings
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    # Initialize Qdrant client
    qdrant_client = QdrantClient(url=os.environ["QDRANT_URL"], api_key=os.environ["QDRANT_API_KEY"], timeout=60)

    # Create or recreate collection
    qdrant_client.recreate_collection(
        collection_name="my-book",
        vectors_config=models.VectorParams(size=len(embeddings.embed_query("text")), distance=models.Distance.COSINE),
    )
    print("Qdrant collection 'my-book' created/recreated.")

    # 3. Generate embeddings and store in Qdrant
    # Embed the chunks
    vectors = embeddings.embed_documents([doc.page_content for doc in chunked_documents])

    # Upsert points to Qdrant
    qdrant_client.upsert(
        collection_name="my-book",
        wait=True,
        points=models.Batch(
            ids=list(range(len(chunked_documents))),
            vectors=vectors,
            payloads=[doc.metadata for doc in chunked_documents],
        ),
    )
    print(f"Ingestion complete. {len(chunked_documents)} chunks added to Qdrant.")

if __name__ == "__main__":
    ingest_data()