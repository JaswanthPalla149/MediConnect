import sys
import json
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig, pipeline
import bitsandbytes as bnb
import huggingface_hub
import logging
import os
from dotenv import load_dotenv

# Configure logging to suppress unwanted info logs
logging.basicConfig(level=logging.WARNING)

# Environment variable setup
ngrok_token = os.getenv("ngrok_tok")

huggingface_token = os.getenv("huggingface_tok")

# Hugging Face login
huggingface_hub.login(huggingface_token)

# Model Name
model_name = "meta-llama/Llama-3.1-8B-Instruct"

# Quantization configuration
bnb_config = BitsAndBytesConfig(
    load_in_8bit=True,
    llm_int8_enable_fp32_cpu_offload=True
)

# Load tokenizer and model with quantization
tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.add_special_tokens({'pad_token': '<PAD>'})

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    quantization_config=bnb_config
)

# Setup the text generation pipeline using GPU (if available)
text_generator = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    max_new_tokens=64
)

def get_response(prompt):
    sequences = text_generator(prompt)
    gen_text = sequences[0]['generated_text']
    return gen_text

if __name__ == "__main__":
    input_text = sys.argv[1] if len(sys.argv) > 1 else ""
    
    if input_text:
        generated_response = get_response(input_text)
        response_text = generated_response[len(input_text):]
    else:
        response_text = "No input text provided."
    
    # JSON response with only the response text
    result = {
        "response": response_text
    }
    
    # Output the JSON response to stdout
    print(json.dumps(result))
