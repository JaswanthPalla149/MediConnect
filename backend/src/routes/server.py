import subprocess
import sys
import os

# Determine the path to requirements.txt
requirements_path = os.path.join(os.getcwd(), "requirements.txt")
print(requirements_path)
pip_install = None
# Install dependencies dynamically
if os.path.exists(requirements_path):
    print(f"Installing dependencies from {requirements_path}...")
   # Ensure that pip install output is suppressed
    pip_install = subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', requirements_path],
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE)
else:
    print(f"Error: {requirements_path} does not exist. Please ensure it is in the correct directory.")

# Check for errors in pip installation
if pip_install.returncode != 0:
    error_message = {"error": f"Error installing requirements: {pip_install.stderr.decode()}"}
    print(json.dumps(error_message))
    sys.exit(1)  # Exit if installation fails

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
