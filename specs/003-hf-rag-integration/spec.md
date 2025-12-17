# Feature Specification: Hugging Face RAG Integration

## 1. Overview

This specification details the resolution of a critical blocking issue preventing the RAG (Retrieval-Augmented Generation) chatbot from functioning correctly due to a deprecated Hugging Face Inference API endpoint and incompatible client library usage. The feature aims to re-enable the chatbot's ability to generate responses by successfully integrating with the updated Hugging Face API.

## 2. Problem Statement

The RAG chatbot backend (`chatbot-backend`) was unable to generate responses from the Hugging Face Inference API. This manifested as:
- `StopIteration` errors when using `langchain_huggingface.HuggingFaceEndpoint` and `huggingface_hub.InferenceClient.text_generation`.
- `410 Gone` errors indicating the old `api-inference.huggingface.co` endpoint was deprecated.
- Persistent `404 Not Found` errors when attempting direct API calls to `router.huggingface.co` with assumed URL structures.
- Inconsistent and empty `inferenceProviderMapping` results from the Hugging Face metadata API.
- Intermittent `NameResolutionError` for `router.huggingface.co`, indicating network instability.

## 3. Solution Proposal

The solution involves migrating the Hugging Face API interaction to a reliable method, specifically utilizing the `huggingface_hub` library's `InferenceClient.chat.completions` API, which is designed for modern conversational AI models and inherently handles the new routing infrastructure. This approach was validated through isolated testing and then integrated into the existing LangChain-based RAG pipeline.

## 4. Key Changes

- **Hugging Face API Endpoint Update:** Confirmed the use of `https://router.huggingface.co` as the base for the Hugging Face Inference API.
- **`huggingface_hub` Client Migration:** Replaced the problematic `langchain_huggingface.HuggingFaceEndpoint` with a custom LangChain LLM wrapper (`CustomHuggingFaceChat`) that internally uses `huggingface_hub.InferenceClient` and its `chat.completions` method.
- **Model Update:** Adopted `meta-llama/Llama-3.1-8B-Instruct` as the primary generative model, validated for compatibility with the new API method.
- **LangChain Integration:** Ensured seamless integration within the existing `langchain_classic.chains.retrieval_qa.base.RetrievalQA` chain, preserving the RAG architecture.
- **Pydantic Compatibility:** Resolved Pydantic v1 validation issues in the custom LLM wrapper to ensure FastAPI server startup stability.
- **Backend Response Formatting:** Adjusted the `/chat` endpoint's response to provide clearer source document information (excerpts and source files).

## 5. Affected Components

- `chatbot-backend/src/services/chatbot_service.py`: Major changes to LLM instantiation and custom wrapper logic.
- `chatbot-backend/main.py`: Minor changes to format the /chat endpoint response.
- `chatbot-backend/test_hf_inference.py` (removed): Testing script that was instrumental in debugging.
- `chatbot-backend/check_langchain.py`, `chatbot-backend/check_langchain_full.py` (removed): Old testing files.
- `session_summary.md` (removed): Session summary file.

## 6. Acceptance Criteria

- The FastAPI chatbot backend starts without errors.
- The `/chat` endpoint responds to queries.
- The chatbot provides relevant answers grounded in the book's content.
- The `sources` in the `/chat` response display readable excerpts and source file names.
- No `StopIteration`, `410 Gone`, `404 Not Found` (from HF API), or `NameResolutionError` (from HF API calls) are observed in the logs.
- The chatbot successfully uses `meta-llama/Llama-3.1-8B-Instruct` via `huggingface_hub.InferenceClient.chat.completions`.
