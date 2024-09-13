import streamlit as st
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from langchain_huggingface import HuggingFacePipeline
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
import tempfile

st.set_page_config(page_title="Simple RAG Chat", layout="wide")

st.title("Simple RAG Chat")

# File uploader
uploaded_file = st.file_uploader("Upload a PDF file", type="pdf")

if uploaded_file is not None:
    # Save uploaded file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        tmp_file.write(uploaded_file.getvalue())
        tmp_file_path = tmp_file.name

    # Load and process the PDF
    loader = PyPDFLoader(tmp_file_path)
    pages = loader.load_and_split()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    texts = text_splitter.split_documents(pages)

    embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vector_store = FAISS.from_documents(texts, embedding)

    # Load model (using a free online model)
    model_name = "facebook/opt-125m"  # A small, free model available online
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name)

    pipe = pipeline("text-generation", model=model, tokenizer=tokenizer, max_new_tokens=100)
    llm = HuggingFacePipeline(pipeline=pipe)

    # Set up RAG
    template = """
    Context: {context}

    Question: {question}

    Answer the question based on the context above.
    """
    retriever = vector_store.as_retriever(search_type='similarity', search_kwargs={'k': 2})
    prompt = PromptTemplate.from_template(template)
    llm_chain = LLMChain(llm=llm, prompt=prompt)

    def get_answer(query):
        content = retriever.get_relevant_documents(query=query)
        context = ''.join(doc.page_content for doc in content)
        response = llm_chain.run({'context': context, 'question': query})
        answer_start = response.find("Answer the question based on the context above.")
        answer_part = response[answer_start + len("Answer the question based on the context above."):].strip()
        return answer_part.replace('\n', ' ').strip()

    # Chat interface
    if 'messages' not in st.session_state:
        st.session_state.messages = []

    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if prompt := st.chat_input("What is your question?"):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            response = get_answer(prompt)
            st.markdown(response)
        st.session_state.messages.append({"role": "assistant", "content": response})

else:
    st.info("Please upload a PDF file to start chatting.")