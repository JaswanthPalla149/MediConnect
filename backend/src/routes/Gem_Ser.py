import sys
import json
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure API key for Google Generative AI (Gemini)
api_key = os.getenv("GEM_KEY")
if not api_key:
    print("Error: GEM_API_KEY is missing in the environment variables.")
    sys.exit(1)

# Set up Google Generative AI
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-1.5-pro')

# Function to generate content using the Google Gemini model
def generate_content(prompt):
    response = model.generate_content(prompt)
    return response.text

# Main function to process input and output
if __name__ == "__main__":
    input_text = sys.argv[1] if len(sys.argv) > 1 else ""
    
    if input_text:
        generated_response = generate_content(input_text)
        response_text = generated_response
    else:
        response_text = "No input text provided."
    
    # Create JSON response with the generated response
    result = {
        "response": response_text
    }
    
    # Output the JSON response to stdout
    print(json.dumps(result))
