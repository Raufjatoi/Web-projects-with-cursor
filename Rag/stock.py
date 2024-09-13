# Import necessary libraries
import yfinance as yf  # For fetching stock data
import re  # For regular expressions
import numpy as np  # For numerical operations
import streamlit as st  # For creating web app
import plotly.graph_objects as go  # For interactive plots
import pickle  # For loading saved objects
from tensorflow import keras  # For deep learning models
import contractions  # For expanding contractions in text
from nltk.corpus import stopwords  # For removing stopwords
from nltk.tokenize import word_tokenize  # For tokenizing text
from nltk.stem import WordNetLemmatizer  # For lemmatizing words

# Load pre-trained models and tokenizer
model1 = keras.models.load_model("model2.keras")
model2 = keras.models.load_model("model3.keras")
model3 = keras.models.load_model("model4.keras")
with open('tokenizer.pkl','rb') as file:
    tokenizer = pickle.load(file)

# Function to preprocess text
def preprocess_text(text):
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
    text = text.lower()  # Convert to lowercase
    text = contractions.fix(text)  # Expand contractions
    text = ''.join([i for i in text if not i.isdigit()])  # Remove digits
    text = ' '.join(text.split())  # Remove extra whitespace
    text = re.sub(r'[^A-Za-z0-9\s]', '', text)  # Remove special characters
    tokens = word_tokenize(text)  # Tokenize text
    tokens = [word for word in tokens if word.isalnum()]  # Keep only alphanumeric tokens
    tokens = [word for word in tokens if word not in stop_words]  # Remove stopwords
    tokens = [lemmatizer.lemmatize(word, pos='v') for word in tokens]  # Lemmatize words
    preprocessed_text = ' '.join(tokens)  # Join tokens back into text
    return preprocessed_text

# Define dictionary mapping company names to stock symbols
stock_dict = {
    "Apple Inc.": "AAPL",
    "Microsoft Corporation": "MSFT",
    # ... (rest of the dictionary)
}

# Create text input and button in Streamlit app
txt = st.text_input("Enter text")
button = st.button("Predict")

# Process input when button is clicked
if button:
    # Preprocess and tokenize input text
    t1 = [txt]
    text_sq = tokenizer.texts_to_sequences(t1)
    text_f = keras.preprocessing.sequence.pad_sequences(text_sq, maxlen=120)
    
    # Make predictions using three models
    pred1 = np.argmax(model1.predict(text_f))
    pred2 = np.argmax(model2.predict(text_f))
    pred3 = np.argmax(model3.predict(text_f))
    
    # Determine final prediction based on majority vote
    if pred1 != pred2 and pred1 != pred3 and pred2 != pred3:
        pred = "Neutral"
    else:
        pred = np.array([pred1,pred2,pred3])
        unique, counts = np.unique(pred, return_counts=True)
        max_count_index = np.argmax(counts)
        pred = unique[max_count_index]
        if pred == 0:
            pred = "Negative"
        elif pred == 1:
            pred = "Neutral"
        elif pred == 2:
            pred = "Positive"
    
    # Display sentiment prediction
    st.write(f"<h3>Sentiment:{pred}<h3>",unsafe_allow_html=True)
    
    # Normalize and split input text
    text = txt
    text_normalized = re.sub(r'[^\w\s]', '', text).lower()
    text_split = [word.rstrip('s') for word in text_normalized.split()]

    # Check for specific company names
    if "tesla" in text_normalized:
        symbol = "TSLA"
        found_name = "Tesla, Inc."
    elif "google" in text_normalized:
        symbol = "GOOGL"
        found_name = "Alphabet Inc."
    elif "meta" in text_normalized or "facebook" in text_normalized:
        symbol = "META"
        found_name = "Meta Platforms, Inc."
    elif "microsoft" in text_normalized:
        symbol = "MSFT"
        found_name = "Microsoft Corporation"
    elif "amazon" in text_normalized:
        symbol = "AMZN"
        found_name = "Amazon"
    else:
        # General matching for other stocks
        symbol = None
        found_name = None
        for name, ticker in stock_dict.items():
            if name.lower() in text_normalized or any(keyword.lower() in text_split for keyword in name.split()):
                symbol = ticker
                found_name = name
                break

        # If no name match is found, check if any stock symbol matches the text
        if not symbol:
            for name, ticker in stock_dict.items():
                if ticker.lower() in text_normalized:
                    symbol = ticker
                    found_name = name
                    break

    # Display stock information and plot if a stock is found
    if symbol:
        st.write(f"<h3>Stock: {symbol}</h3>", unsafe_allow_html=True)

        # Fetch stock price using yfinance
        stock = yf.Ticker(symbol)
        data = stock.history(period='1mo')

        if not data.empty:
            # Extract data for plotting
            dates = data.index
            close_prices = data['Close']

            # Create Plotly figure
            fig = go.Figure()

            # Add traces for different price types and moving averages
            fig.add_trace(go.Scatter(x=dates, y=close_prices, mode='lines+markers', name='Close Price', line=dict(color='green')))
            fig.add_trace(go.Scatter(x=dates, y=data['Open'], mode='lines+markers', name='Open Price', line=dict(color='red')))
            fig.add_trace(go.Scatter(x=dates, y=data['Low'], mode='lines+markers', name='Low Price', line=dict(color='blue')))
            fig.add_trace(go.Scatter(x=dates, y=data['High'], mode='lines+markers', name='High Price', line=dict(color='orange')))
            fig.add_trace(go.Scatter(x=dates, y=data['Close'].rolling(window=5).mean(), mode='lines', name='5-day MA', line=dict(color='purple', dash='dash')))
            fig.add_trace(go.Scatter(x=dates, y=data['Close'].rolling(window=10).mean(), mode='lines', name='10-day MA', line=dict(color='yellow', dash='dash')))
            fig.add_trace(go.Scatter(x=dates, y=data['Close'].rolling(window=20).mean(), mode='lines', name='20-day MA', line=dict(color='pink', dash='dash')))

            # Update layout
            fig.update_layout(
                title=f'{found_name} Stock Price Over Last Month',
                xaxis_title='Date',
                yaxis_title='Price',
                template='plotly_dark'
            )

            # Show the plot
            st.plotly_chart(fig)
        else:
            st.write('No stock data available.')
    else:
        st.write('No relevant stock symbol found.')