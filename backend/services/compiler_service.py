import json
import requests
from flask import Blueprint, request, jsonify
from utils.mongo_util import mongo_util
from utils.constants import COMPILE_URL   


class Compiler_Service:

    @staticmethod
    def run_Code():
        data = request.json
        code = data.get("code", "")
        language = data.get("language", "python")
        version = data.get("version", "3.10.0")

        if not code:
            return jsonify({"error": "code is empty"}), 400

        # Piston API payload
        payload = {
            "language": language,
            "version": version,
            "files": [
                {
                    "name": "main.py",
                    "content": code
                }
            ]
        }

        # Make POST request to Piston API
        try:
            response = requests.post(
                COMPILE_URL,
                headers={"Content-Type": "application/json"},
                data=json.dumps(payload)
            )

            if response.status_code != 200:
                return jsonify({
                    "error": "Compiler API error",
                    "status": response.status_code,
                    "details": response.text
                }), 500
            result = response.json()

        # clean stdout if exists
            if "run" in result and "stdout" in result["run"]:
                result["run"]["stdout_clean"] = Compiler_Service.clean_code(result["run"]["stdout"])

            return jsonify(result), 200
        except:
            return jsonify({"error" : " error in getting the code "}) , 401 
    
    @staticmethod
    def clean_code(output) :
        """
        Convert escaped newline sequences like '\n' into real newlines.
        Trim trailing whitespace.
        """
        if not output:
            return ""

        # Replace escaped newlines with real newlines
        cleaned = output.replace("\\n", "\n")

        # Optional: strip trailing newline/spaces
        cleaned = cleaned.strip()

        return cleaned


