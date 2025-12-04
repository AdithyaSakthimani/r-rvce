import json
from flask import Blueprint, request, jsonify
from services.tokenizer_service import tokenizer_service
inference_bp = Blueprint("deepseek", __name__)

@inference_bp.route("/question", methods=["POST"])
def signup():
    return tokenizer_service.run_inference()