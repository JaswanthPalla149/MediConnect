import subprocess
import sys
import os

# Determine the path to requirements.txt
requirements_path = os.path.join(os.getcwd(), r"backend\src\routes\requirements.txt")

# Install dependencies dynamically
if os.path.exists(requirements_path):
    print(f"Installing dependencies from {requirements_path}...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", requirements_path], check=True)
else:
    print(f"Error: {requirements_path} does not exist. Please ensure it is in the correct directory.")


#import sys
import json
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk

# Download the VADER lexicon for sentiment analysis
nltk.download('vader_lexicon')

# Initialize the Sentiment Intensity Analyzer
sia = SentimentIntensityAnalyzer()

def analyze_sentiment(text):
    # Analyze the sentiment
    sentiment_scores = sia.polarity_scores(text)
    return sentiment_scores

if __name__ == "__main__":
    # Get the input text from the command line arguments
    input_text = sys.argv[1] if len(sys.argv) > 1 else ""
    result = analyze_sentiment(input_text)

    # Print the result as JSON for Node.js to capture
    print(json.dumps(result))
