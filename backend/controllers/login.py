import json
from flask import Blueprint, request, jsonify
from services.login_service import Login_Service
login_bp = Blueprint("auth", __name__)

@login_bp.route("/signup", methods=["POST"])
def signup():
    """
    API endpoint to synchronize Google Calendar.
    Generates an OAuth URL if credentials are missing or invalid.
    """
    return Login_Service.signup()
@login_bp.route("/login", methods=["POST"])
def login ():

    return Login_Service.login()
