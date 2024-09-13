# Import necessary libraries
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from langchain_huggingface import HuggingFacePipeline
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
import streamlit as st
import tempfile

# Set the path to the custom model
custom_model_path = r"..."

# Load the tokenizer and model from the custom path
tokenizer = AutoTokenizer.from_pretrained(custom_model_path)
model = AutoModelForCausalLM.from_pretrained(custom_model_path)

# Create a text generation pipeline
pipe = pipeline("text-generation", model=model, tokenizer=tokenizer, max_new_tokens=100)

# Create a HuggingFacePipeline object
llm = HuggingFacePipeline(pipeline=pipe)

# Create a file uploader in the sidebar
uploaded_file = st.sidebar.file_uploader("Upload a PDF", type="pdf")
# Add a button to clear the chat
clear_chat = st.sidebar.button("Clear Chat")

# Set the title of the Streamlit app
st.title("RAG based Document Bot")
# Create a chat input field
query = st.chat_input("Enter your query:")

# Clear the chat history if the clear button is pressed
if clear_chat:
    st.session_state.messages = []

# Process the uploaded file
if uploaded_file is not None:
    # Save the uploaded PDF to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        tmp_file.write(uploaded_file.read())
        tmp_file_path = tmp_file.name

    # Load and split the PDF into pages
    loader = PyPDFLoader(tmp_file_path)
    pages = loader.load_and_split()

    # Split the text into smaller chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    texts = text_splitter.split_documents(pages)

    # Create embeddings and a vector store
    embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vector_store = FAISS.from_documents(texts, embedding)

    # Define a template for the question-answering prompt
    template = """
    Context: {context}

    Question: {question}

    Answer the question based on the context above.
    """
    # Create a retriever from the vector store
    retriever = vector_store.as_retriever(search_type='similarity', search_kwargs={'k': 2})

    # Create a PromptTemplate object
    prompt = PromptTemplate.from_template(template)

    # Create an LLMChain object
    llm_chain = LLMChain(llm=llm, prompt=prompt)

    # Example question and context retrieval
    question = "Is hate discussed in The Subtle Art of Not Giving a F*ck?"
    content = retriever.get_relevant_documents(query=question)
    context = ''.join(content[i].page_content for i in range(len(content)))

    # Function to get an answer for a given query
    def get_answer(query):
        response = llm_chain.run({'context': context, 'question': query})
        answer_start = response.find("Answer the question based on the context above.")
        answer_part = response[answer_start + len("Answer the question based on the context above."):].strip()
        answer_part = answer_part.replace('\n', ' ').strip()
        return answer_part

    # Initialize the chat history if it doesn't exist
    if 'messages' not in st.session_state:
        st.session_state.messages = []

    # Display the chat history
    for msg in st.session_state.messages:
        st.chat_message(msg['role']).markdown(msg['content'])
    
    # Process the user's query
    if query:
        # Display the user's query
        st.chat_message("user").markdown(query)
        # Get the answer
        response = get_answer(query)
        # Add the user's query to the chat history
        st.session_state.messages.append({'role': 'user', 'content': query})

        # Display the AI's response
        st.chat_message('ai').markdown(response)
        # Add the AI's response to the chat history
        st.session_state.messages.append({'role': 'ai', 'content': response})
else:
    # Display a message if no PDF is uploaded
    st.sidebar.info("Please upload a PDF document to start chatting.")