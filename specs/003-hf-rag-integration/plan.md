# Architectural Plan: Hugging Face RAG Integration

## 1. Scope and Dependencies

**In Scope:**
- Integration of a functional Hugging Face generative model into the existing LangChain RAG pipeline.
- Resolution of previous API connectivity issues with Hugging Face.
- Ensuring the FastAPI chatbot backend can generate grounded responses.
- Maintaining compatibility with the existing Qdrant retrieval mechanism.
- Presenting user-friendly source information in the API response.

**Out of Scope:**
- Optimizing model performance or response latency (beyond ensuring basic functionality).
- Implementing advanced RAG techniques (e.g., query rewriting, re-ranking).
- Deploying the FastAPI backend or the Docusaurus frontend.
- Addressing the external `better-auth` service compilation issues.

**External Dependencies:**
- **Hugging Face Inference API:** `https://router.huggingface.co`
- **Qdrant Cloud:** `os.environ["QDRANT_URL"]`, `os.environ["QDRANT_API_KEY"]`
- **Generative Model:** `meta-llama/Llama-3.1-8B-Instruct`
- **Libraries:** `huggingface_hub`, `langchain_core`, `langchain_qdrant`, `langchain_huggingface` (for embeddings).

## 2. Key Decisions and Rationale

**Decision 1: Adopt `huggingface_hub.InferenceClient.chat.completions`**
- **Rationale:** Direct usage of the `huggingface_hub` library's `chat.completions` API proved to be the only reliable method for connecting to the new Hugging Face routing infrastructure, resolving `StopIteration` and `404` errors encountered with other methods (e.g., `text_generation` or `langchain_huggingface.HuggingFaceEndpoint`). This API also provides a modern, OpenAI-compatible interface.
- **Trade-offs:** Required custom LangChain integration as `huggingface_hub.InferenceClient` is not a native LangChain LLM.

**Decision 2: Implement a Custom LangChain `LLM` Wrapper (`CustomHuggingFaceChat`)**
- **Rationale:** To seamlessly integrate the `huggingface_hub.InferenceClient.chat.completions` API into the existing `RetrievalQA` chain without re-architecting the entire RAG pipeline. This preserves the LangChain framework's benefits.
- **Trade-offs:** Required careful handling of Pydantic and LangChain's `LLM` base class (`__init__`, `_call`, `PrivateAttr`, `root_validator`) for correct instantiation and compatibility.

**Decision 3: Use `meta-llama/Llama-3.1-8B-Instruct` as the Generative Model**
- **Rationale:** This model was successfully tested in isolation and is a widely recognized, powerful, instruction-following model highly suitable for RAG tasks, ensuring high-quality answer generation from provided context.
- **Trade-offs:** Larger model size compared to `flan-t5-base` might imply higher latency or cost, though these were not within the immediate scope of this fix.

**Decision 4: Format `sources` in API response with excerpts and source file names**
- **Rationale:** To improve the user experience (UX) by providing concise and informative source attribution directly within the API response, avoiding console truncation issues and making the grounding of answers transparent.
- **Trade-offs:** Required a minor adjustment in `main.py`'s response formatting.

## 3. Interfaces and API Contracts

**Modified API Endpoint:**
- `/chat (POST)`:
    - **Request:** Unchanged (still expects `ChatRequest` with `query` and optional `selected_text`).
    - **Response:**
        ```json
        {
            "answer": "string", // The generated answer from the LLM
            "sources": [
                {
                    "excerpt": "string", // First 200 characters of the retrieved document content
                    "source_file": "string" // Filename or path of the source document
                },
                // ... potentially multiple source objects ...
            ]
        }
        ```
    - **Errors:** Standard FastAPI HTTP exceptions (e.g., `500 Internal Server Error` if LLM call fails, `400 Bad Request` for invalid input).

## 4. Non-Functional Requirements (NFRs) and Budgets

- **Reliability:** The primary goal was to achieve reliability in connecting to the Hugging Face Inference API. The new solution is more robust due to direct API usage.
- **Performance:** Response latency is expected to be dictated by the chosen LLM (`Llama-3.1-8B-Instruct`) and network conditions to Hugging Face. No specific performance targets were set for this integration.
- **Security:** API token (`HUGGINGFACEHUB_API_TOKEN`) is managed via environment variables and passed securely as a Bearer token. No new security vulnerabilities introduced.

## 5. Data Management and Migration

- **Qdrant Data:** Unchanged. The existing Qdrant collection "my-book" (populated by `ingest.py`) remains the source of truth for document chunks and embeddings.
- **Embeddings:** Continues to use `sentence-transformers/all-MiniLM-L6-v2`.

## 6. Operational Readiness

- **Observability:** `print` statements were added for debugging purposes during development and removed for production readiness. LLM errors are caught and logged internally.
- **Deployment:** The FastAPI application remains deployable. No new complex deployment steps introduced beyond standard Python application deployment.
- **Environment Variables:**
    - `HUGGINGFACEHUB_API_TOKEN`: Required for LLM authentication.
    - `QDRANT_URL`, `QDRANT_API_KEY`: Required for Qdrant connection.
    - `HF_INFERENCE_ENDPOINT`: Not strictly required by `CustomHuggingFaceChat` but can be set by `huggingface_hub` for global configuration. (Though removed direct reliance on it for `InferenceClient`.)

## 7. Risk Analysis and Mitigation

- **Risk:** Future changes in Hugging Face API or `huggingface_hub` library.
    - **Mitigation:** The custom wrapper provides a single point of abstraction. Any future changes can be contained within `CustomHuggingFaceChat`.
- **Risk:** Performance degradation due to `Llama-3.1-8B-Instruct` model size.
    - **Mitigation:** Monitor latency. If an issue, a smaller, compatible model can be swapped in within `CustomHuggingFaceChat`.

## 8. Evaluation and Validation

- **Definition of Done:**
    - FastAPI server starts successfully.
    - `test_hf_inference.py` (after being reverted to `huggingface_hub` client) passes.
    - `/chat` endpoint successfully returns answers and formatted sources for various book-related queries.
    - No exceptions related to LLM connectivity or Pydantic validation are observed.
- **Output Validation:** Ensure answers are relevant and sources are correctly attributed.
