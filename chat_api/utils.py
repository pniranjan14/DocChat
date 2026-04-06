import os
from django.conf import settings
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

def get_embeddings():
    """
    Returns the HuggingFace embeddings model (local).
    Using all-MiniLM-L6-v2 for speed and efficiency.
    """
    model_name = "all-MiniLM-L6-v2"
    model_kwargs = {'device': 'cpu'}
    encode_kwargs = {'normalize_embeddings': False}
    return HuggingFaceEmbeddings(
        model_name=model_name,
        model_kwargs=model_kwargs,
        encode_kwargs=encode_kwargs
    )

def ingest_document(file_path, doc_id):
    """
    Loads, splits and stores a PDF document into the FAISS index with metadata tagging.
    """
    # 1. Load PDF
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    
    # 2. Split Text and add doc_id to metadata
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    chunks = text_splitter.split_documents(documents)
    for chunk in chunks:
        chunk.metadata["doc_id"] = str(doc_id)
    
    # 3. Create or Update FAISS index
    embeddings = get_embeddings()
    index_path = os.path.join(settings.BASE_DIR, "faiss_index")
    
    if os.path.exists(index_path):
        vectorstore = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)
        vectorstore.add_documents(chunks)
    else:
        vectorstore = FAISS.from_documents(chunks, embeddings)
        
    vectorstore.save_local(index_path)
    return len(chunks)

def query_index(query, k=4, doc_id=None):
    """
    Retrieves the most relevant chunks for a given query, optionally filtered by doc_id.
    """
    embeddings = get_embeddings()
    index_path = os.path.join(settings.BASE_DIR, "faiss_index")
    
    if not os.path.exists(index_path):
        return []
        
    vectorstore = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)
    
    search_kwargs = {"k": k}
    if doc_id:
        search_kwargs["filter"] = {"doc_id": str(doc_id)}
        
    results = vectorstore.similarity_search(query, **search_kwargs)
    return results

def get_answer(query, doc_id=None):
    """
    Orchestrates the RAG flow with optional document-specific filtering.
    """
    # 1. Setup Groq
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return "GROQ_API_KEY not found in environment.", []

    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0,
        api_key=api_key
    )

    # 2. Setup Prompt
    system_prompt = (
        "You are an assistant for question-answering tasks. "
        "Use the following pieces of retrieved context to answer the question. "
        "The context is restricted to the specific document currently active in the chat. "
        "If you don't know the answer, just say that you don't know based on THIS document. "
        "Maintain a helpful and professional tone. "
        "\n\n"
        "{context}"
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])

    # 3. Setup Components
    embeddings = get_embeddings()
    index_path = os.path.join(settings.BASE_DIR, "faiss_index")
    
    if not os.path.exists(index_path):
        return "No documents uploaded yet.", []
        
    vectorstore = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)
    
    search_kwargs = {}
    if doc_id:
        search_kwargs["filter"] = {"doc_id": str(doc_id)}
        
    retriever = vectorstore.as_retriever(search_kwargs=search_kwargs)
    
    # 4. Define LCEL Chain
    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {"context": retriever | format_docs, "input": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    # 5. Execute and extract unique sources
    context_docs = retriever.invoke(query)
    answer = rag_chain.invoke(query)
    
    sources = []
    seen = set()
    for doc in context_docs:
        page = doc.metadata.get("page")
        content_snippet = doc.page_content[:200].strip()
        key = (page, content_snippet)
        if key not in seen:
            sources.append({
                "page": page,
                "content": content_snippet + "..."
            })
            seen.add(key)
            
    return answer, sources
