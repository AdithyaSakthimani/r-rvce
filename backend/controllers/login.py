import json
from flask import Blueprint, request, jsonify
#import loginService
login_bp = Blueprint("login", __name__)

@login_bp.route("/", methods=["GET"])
def test():
    """
    API endpoint to synchronize Google Calendar.
    Generates an OAuth URL if credentials are missing or invalid.
    """
    return "hello"
@login_bp.route("/get_val", methods=["POST"])
def test1():
    data = request.json         
    print(data)
    return jsonify(data) 
