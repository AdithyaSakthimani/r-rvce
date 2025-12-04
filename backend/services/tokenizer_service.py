import os
from flask import request
from openai import OpenAI
from utils.constants import HF_TOKEN
api_key = HF_TOKEN
client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=HF_TOKEN,
)


class tokenizer_service:
    @staticmethod
    def run_inference():
        
        data = request.get_json()
        question = data.get('question', '')

        completion = client.chat.completions.create(
        model="deepseek-ai/DeepSeek-V3.2:novita",
        messages=[
            {
                "role": "user",
                "content": question
            }
            ],
        )
        return str(completion.choices[0].message)

