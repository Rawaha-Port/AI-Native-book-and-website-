import os
from dotenv import load_dotenv
from typing import List, Optional, Any, Dict

from qdrant_client import QdrantClient
from langchain_qdrant import QdrantVectorStore
from langchain_huggingface.embeddings import HuggingFaceEmbeddings

from langchain_core.language_models.llms import LLM
from langchain_core.callbacks import CallbackManagerForLLMRun # New import
from huggingface_hub import InferenceClient
from pydantic.v1 import Field, root_validator, PrivateAttr, PrivateAttr # Use Pydantic v1's root_validator

# These imports are for langchain_classic
from langchain_classic.prompts import PromptTemplate
from langchain_classic.chains.llm import LLMChain
from langchain_classic.chains.combine_documents.stuff import StuffDocumentsChain
from langchain_classic.chains.retrieval_qa.base import RetrievalQA

load_dotenv()

# --- Custom LangChain LLM Wrapper (Pydantic v1 compatible) ---
class CustomHuggingFaceChat(LLM):
    model_id: str
    _client: InferenceClient = PrivateAttr() # Private attribute, initialized in __init__

    def __init__(self, model_id: str, **kwargs: Any):
        super().__init__(model_id=model_id, **kwargs) # Pass model_id to super
        token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
        if not token:
            raise ValueError("HUGGINGFACEHUB_API_TOKEN not found in environment variables.")
        self._client = InferenceClient(token=token) # Initialize PrivateAttr directly

    @property
    def _llm_type(self) -> str:
        return "custom_huggingface_chat"

    def _call(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None, # Added run_manager
        **kwargs
    ) -> str:
        try:
            # The 'prompt' from LangChain contains the full context and question.
            # We pass this directly to the user message.
            response = self._client.chat.completions.create(
                model=self.model_id,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that answers questions based on the provided context."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1024, # A reasonable limit for the generated answer
                temperature=0.1, # Lower temperature for more factual, less creative answers
            )
            return response.choices[0].message.content
        except Exception as e:
            # In case of an API error, return a user-friendly message.
            print(f"Error during Hugging Face API call: {e}")
            return "Sorry, I encountered an error while trying to generate a response."
    
    @property
    def _identifying_params(self) -> Dict[str, Any]:
        """Get the identifying parameters."""
        return {"model_id": self.model_id}

# Initialize HuggingFace embeddings
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Initialize Qdrant and Hugging Face components
client = QdrantClient(
    url=os.environ["QDRANT_URL"],
    api_key=os.environ["QDRANT_API_KEY"],
)
qdrant_vectorstore = QdrantVectorStore(
    client=client,
    collection_name="my-book",
    embedding=embeddings,
)

# Instantiate our new custom LLM
llm = CustomHuggingFaceChat(model_id="meta-llama/Llama-3.1-8B-Instruct")

# Define the prompt template for the LLMChain
# It expects {context} and {question}
prompt_template = """Use the following pieces of context to answer the user's question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

{context}

Question: {question}
Helpful Answer:"""

qa_prompt = PromptTemplate(
    template=prompt_template, input_variables=["context", "question"]
)

# 1. Create the LLMChain for Document Combination
llm_chain = LLMChain(llm=llm, prompt=qa_prompt)

# 2. Create the StuffDocumentsChain
combine_documents_chain = StuffDocumentsChain(
    llm_chain=llm_chain, document_variable_name="context"
)

# 3. Prepare the Retriever
retriever = qdrant_vectorstore.as_retriever() # Uses our existing Qdrant retriever

# 4. Manually construct the RetrievalQA chain
qa_chain = RetrievalQA(
    retriever=retriever,
    combine_documents_chain=combine_documents_chain,
    return_source_documents=True # Optional: to see the source documents used
)